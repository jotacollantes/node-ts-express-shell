import mongoose from 'mongoose';


const userSchema = new mongoose.Schema( {

  name: {
    type: String,
    required: [ true, 'Name is required' ]
  },
  email: {
    type: String,
    required: [ true, 'Email is required' ],
    unique: true,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [ true, 'Password is required' ]
  },
  img: {
    type: String,
  },
  role: {
    type: [String],
    default: ['USER_ROLE'],
    enum: ['ADMIN_ROLE','USER_ROLE']
  }

} );

userSchema.set('toJSON', {
  virtuals: true, //Anade el campo id con el mismo valor de _id
  versionKey: false, //Elimina de la respuesta el campo --v
  transform: function( doc, ret, options ) {
    delete ret._id; //Elimina de la respuesta el campo _id
    delete ret.password; //Elimina de la respuesta el campo de contrasena
  },
})



export const UserModel = mongoose.model('User', userSchema);

