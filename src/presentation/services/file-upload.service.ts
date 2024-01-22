import path from "path";
import fs from "fs";

import { UploadedFile } from "express-fileupload";

import { Uuid } from "../../config";
import { CustomError } from "../../domain";

export class FileUploadService {
  //! Usamos el uuid por defecto que es la clase Uuid
  constructor(private readonly uuid = Uuid.v4) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  async uploadSingle(
    file: UploadedFile,
    folder: string = "uploads",
    validExtensions: string[] = ["png", "gif", "jpg", "jpeg"]
  ) {
    try {
      //! Obtenemos la extension del archivo
      const fileExtension = file.mimetype.split("/").at(1) ?? "";
      if (!validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(
          `Invalid extension: ${fileExtension}, valid ones ${validExtensions}`
        );
      }

      const destination = path.resolve(__dirname, "../../../", folder);
      //! Validamos la existensia del directorio
      this.checkFolder(destination);

      const fileName = `${this.uuid()}.${fileExtension}`;
      //!El metodo mv() lo da la interface UploadedFile de express
      file.mv(`${destination}/${fileName}`);

      return { fileName };
    } catch (error) {
      // console.log({error});
      throw error;
    }
  }

  async uploadMultiple(
    files: UploadedFile[],
    folder: string = "uploads",
    validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
  ) {
    //! como files es un arreglo usamos el metodo this.uploadSingle() dentro de un promise.all
    const fileNames = await Promise.all(
      files.map((file) => this.uploadSingle(file, folder, validExtensions))
    );

    return fileNames;
  }
}
