import { envs } from '../../config';
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from '../mongo';
import { seedData } from './data';


(async()=> {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL
  })

  await main();


  await MongoDatabase.disconnect();
})();


const randomBetween0AndX = ( x: number ) => {
  //random devuelve 0 o 1
  //floor redondea al entero menor Ex. 45.95 -> 45
  return Math.floor( Math.random() * x );
}



async function main() {

  // 0. Borrar todo!
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ])


  // 1. Crear usuarios
  const users = await UserModel.insertMany( seedData.users );

  // 2. Crear categorias
  const categories = await CategoryModel.insertMany(
    seedData.categories.map( category => {

      return {
        ...category,
        user: users[0]._id
      }

    })
  );

  // 3. Crear productos
  const products = await ProductModel.insertMany(
    seedData.products.map( product => {

      return {
        ...product,
        //El indice es aleatorio, envio como argumento el numero de elementos del arreglo
        user: users[ randomBetween0AndX( seedData.users.length - 1 ) ]._id,
        //El indice es aleatorio, envio como argumento el numero de elementos del arreglo
        category: categories[ randomBetween0AndX( seedData.categories.length - 1 )  ]._id
      }
    })
  );
  console.log('SEEDED');
}
