import mongoose, { Schema } from 'mongoose';


const categorySchema = new mongoose.Schema( {

  name: {
    type: String,
    required: [ true, 'Name is required' ],
    unique: true,
  },
  available: {
    type: Boolean,
    default: false,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  

} );


categorySchema.set('toJSON', {
  virtuals: true, //Anade el campo id con el mismo valor de _id
  versionKey: false, //Elimina de la respuesta el campo --v
  transform: function( doc, ret, options ) {
    delete ret._id; //Elimina de la respuesta el campo _id 
  },
})



export const CategoryModel = mongoose.model('Category', categorySchema);

