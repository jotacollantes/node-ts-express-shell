import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.service';




export class AuthService {

  // DI
  constructor(
    // DI - Email Service
    private readonly emailService: EmailService,
  ) {}


  public async registerUser( registerUserDto: RegisterUserDto ) {

    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if ( existUser ) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      
      // Encriptar la contraseña
      user.password = bcryptAdapter.hash( registerUserDto.password );
      
      await user.save();

      // Email de confirmación
      await this.sendEmailValidationLink( user.email );

      const { password, ...userEntity } = UserEntity.fromObject(user);
      
      //!Este token (que solo incluye el id) no es el mismo que el token que se genera y que es enviado por email para validadar la cuenta,
      const token = await JwtAdapter.generateToken({ id: user.id });
      if ( !token ) throw CustomError.internalServer('Error while creating JWT');

      return { 
        user: userEntity, 
        token: token,
      };

    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }

  }


  public async loginUser( loginUserDto: LoginUserDto ) {

    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email not exist');

    const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
    if ( !isMatching ) throw CustomError.badRequest('Password is not valid');


    const { password, ...userEntity} = UserEntity.fromObject( user );
    
    const token = await JwtAdapter.generateToken({ id: user.id });
    if ( !token ) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token: token,
    }

  }


  private sendEmailValidationLink = async( email: string ) => {

    const token = await JwtAdapter.generateToken({ email });
    console.log(token)
    if ( !token ) throw CustomError.internalServer('Error getting token');

    const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${ link }">Validate your email: ${ email }</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody:html,
    }

    const isSent = await this.emailService.sendEmail(options);
    if ( !isSent ) throw CustomError.internalServer('Error sending email');

    return true;
  }


  public validateEmail = async(token:string) => {
    //!Verificamos el token
    const payload = await JwtAdapter.validateToken(token);
    console.log({payload})
    if ( !payload ) throw CustomError.unauthorized('Invalid token');
    
    //! El payload como en el metodo JwtAdapter.validateToken() viene de tipo unknow se le puede especificar de tipo string y verificamos si es que existe en correo en el payload.
    
    const { email } = payload as { email: string } ;
    if ( !email ) throw CustomError.internalServer('Email not in token');

    //!Verificamos la existencia del usuario en la BD
    const user = await UserModel.findOne({ email });
    if ( !user ) throw CustomError.internalServer('Email not exists');

    //! Actualizamos el campo emailValidated en la BD en true 
    user.emailValidated = true;
    await user.save();

    return true;
  }


}