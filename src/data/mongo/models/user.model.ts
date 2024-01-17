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
    //! Cuando el campo tiene configurado una enumeracion es necesario que cuando el tipo sea un array hay que especificar [String] y no el tipo de dato Array
    type: [String],
    //type: Array,
    default: ['USER_ROLE'],
    enum: ['ADMIN_ROLE','USER_ROLE']
  }

} );


export const UserModel = mongoose.model('User', userSchema);

