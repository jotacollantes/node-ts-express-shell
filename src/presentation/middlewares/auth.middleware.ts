import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { UserEntity } from '../../domain';


export class AuthMiddleware {


  static async validateJWT( req: Request, res: Response, next: NextFunction ) {

    //* header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTk2MGU3ZDJkNmZmNWNjNGI2MzI5NSIsImlhdCI6MTcwNTYxMTM1NywiZXhwIjoxNzA1NjE4NTU3fQ.1wRkxQXXdhUQVMlHIVmRQjUllBgwjCSOI93NsppH0ys'
    const authorization = req.header('Authorization');
    //* authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTk2MGU3ZDJkNmZmNWNjNGI2MzI5NSIsImlhdCI6MTcwNTYxMTM1NywiZXhwIjoxNzA1NjE4NTU3fQ.1wRkxQXXdhUQVMlHIVmRQjUllBgwjCSOI93NsppH0ys'
    if( !authorization ) return res.status(401).json({ error: 'No token provided' });
    if ( !authorization.startsWith('Bearer ') ) return res.status(401).json({ error: 'Invalid Bearer token' });
    //tambien puede ser asi authorization.split(' ')[1] para tomar la segunda posicion
    //* token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTk2MGU3ZDJkNmZmNWNjNGI2MzI5NSIsImlhdCI6MTcwNTYxMTM1NywiZXhwIjoxNzA1NjE4NTU3fQ.1wRkxQXXdhUQVMlHIVmRQjUllBgwjCSOI93NsppH0ys'

    //para tomar la segunda posicion
    const token = authorization.split(' ').at(1) || '';


    try {
      //! le especificamos a validateToken que su interfaz generica sera { id: string }
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if ( !payload ) return res.status(401).json({ error: 'Invalid token' })

      //! validamos la existencia del usuario
      const user = await UserModel.findById( payload.id );
      if ( !user ) return res.status(401).json({ error: 'Invalid token - user' });

      // todo: validar si el usuario está activo
       
      //!Modificamos la request body con los datos del UserEntity
      req.body.user = UserEntity.fromObject(user);
       //! Procede con la ejecucion del controlador
       console.log('autenticacion OK') 
      next();

    } catch (error) {
      
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });

    }
    
  }




}


