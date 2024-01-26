import { Router } from 'express';
import { Authroutes } from './auth/routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir mapa de rutas
    router.use('/api/auth', Authroutes.routes );



    return router;
  }


}

