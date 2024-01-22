import { NextFunction, Request, Response } from 'express';



export class TypeMiddleware {

  //!Recibimo validTypes como una inyeccion de dependencia y retornamos la funcion
  static validTypes( validTypes: string[] ) {

    return ( req: Request, res: Response, next: NextFunction ) => {
      //! como el middleware se ejecuta antes de las invocaciones de las rutas el type viene como undefined por eso en este punto hay que leer las req.url para obtener el type Ex. {type:'products'}
      const type = req.url.split('/').at(2) ?? '';

      if ( !validTypes.includes( type ) ) {
        return res.status( 400 )
          .json( { error: `Invalid type: ${ type }, valid ones ${ validTypes }` } );
      }

      next();

    };


  }



}