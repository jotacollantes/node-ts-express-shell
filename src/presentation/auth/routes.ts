import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';




export class Authroutes {


  static get routes(): Router {

    const router = Router();
    //! Creo una instancia de AuthService que sera inyectada en el controlador AuthController()
    const authService = new AuthService();
    //!AuthCOntroller recibira como parametro del constructor o inyeccion de dependencia una instancia de AuthService() 
    const controller = new AuthController(authService);
    
    // Definir las rutas
    router.post('/login', controller.loginUser );
    router.post('/register', controller.registerUser );
    
    router.get('/validate-email/:token', controller.validateEmail );



    return router;
  }


}

