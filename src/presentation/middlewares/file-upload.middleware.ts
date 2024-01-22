import { NextFunction, Request, Response } from "express";

export class FileUploadMiddleware {
  static containFiles(req: Request, res: Response, next: NextFunction) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files were selected" });
    }
    //! si no es un array en el caso de un singleUploadFile (single file viene como un objeto, multiple files viene como un array)
    //! .file es el nombre del campo que viene desde la request
    if (!Array.isArray(req.files.file)) {
      //! Lo homologamos como un array
      req.body.files = [req.files.file];
    } else {
      //! Lo mantenemos como un array
      req.body.files = req.files.file;
    }
    //! Si todo sale bienc continuamos con la ejecucion del controlador
    next();
  }
}
