import { Response, Request } from 'express';
import { CustomError } from '../../domain';
import { FileUploadService } from '../services/file-upload.service';
import { UploadedFile } from 'express-fileupload';



export class FileUploadController {

  // DI
  constructor(
    private readonly fileUploadService: FileUploadService,
  ) { }


  private handleError = ( error: unknown, res: Response ) => {
    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json( { error: error.message } );
    }

    console.log( `${ error }` );
    return res.status( 500 ).json( { error: 'Internal server error' } );
  };


  uploadFile = ( req: Request, res: Response ) => {
   //! Este middleware his.app.use(fileUpload({})); establece la propiedad file en la Req.

   //! .type es el aregumento que se envia en la ruta del controlador:  router.post("/single/:type")
    const type = req.params.type;
    //! El middleware se encargo de grabar las imagenes en req.body.files
    const file = req.body.files.at(0) as UploadedFile;

    //! type es la subcarpeta que puede ser users, categories, products
    this.fileUploadService.uploadSingle( file, `uploads/${ type }` )
      .then( uploaded => res.json(uploaded) )
      .catch(  error => this.handleError( error, res ) )

  };

  
  uploadMultipleFiles = ( req: Request, res: Response ) => {

    const type = req.params.type;
    const files = req.body.files as UploadedFile[];

    
    this.fileUploadService.uploadMultiple( files, `uploads/${ type }` )
      .then( uploaded => res.json(uploaded) )
      .catch(  error => this.handleError( error, res ) )

  };


}