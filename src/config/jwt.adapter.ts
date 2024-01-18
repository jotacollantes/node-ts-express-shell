import jwt from 'jsonwebtoken';
import { envs } from './envs';


const JWT_SEED = envs.JWT_SEED;



export class JwtAdapter {

  // DI?

  static async generateToken( payload:any, duration: string = '2h' ) {
   console.log({payload})
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        
        if ( err ) return resolve(null);

        resolve(token)

      });
    })



  }


  static validateToken(token: string) {
    
    return new Promise( (resolve) => {

      jwt.verify( token, JWT_SEED, (err, decoded) => {
        //! La promesa siempre se va a resolver de manera exitosa
        //!Si sucede un error      
        if( err ) return resolve(null);
        //! Si se resuelve de manera exitosa se envia el payload decodificado
        resolve(decoded);

      });



    })
  }


}

