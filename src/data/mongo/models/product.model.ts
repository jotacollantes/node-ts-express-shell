import mongoose, { Schema } from 'mongoose';


const productSchema = new mongoose.Schema( {

  name: {
    type: String,
    required: [ true, 'Name is required' ],
    unique: true,
  },
  available: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
  },
  
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
  

} );

//Para serializar una respuesta a un  objeto Json
productSchema.set('toJSON', {
  virtuals: true, //virtuals anade el campo id con el mismo valor del campo _id
  versionKey: false, // quita el campo --v
  transform: function( doc, ret, options ) {
    delete ret._id; //Eliminamos el campo _id de la respuesta
  },
})


export const ProductModel = mongoose.model('Product', productSchema);

