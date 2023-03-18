const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
   email: {
  type: String,
  required: true,
  unique: true, // Ensure that the email is unique
  validate: {
    validator: async function (email) {
      try {
        const existingUser = await this.constructor.findOne({ email }); // Check if a user with the same email already exists
        return !existingUser; // Return true if no user with the same email exists, false otherwise
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    message: 'Email already exists', // Error message to be thrown if the email already exists
  },
},
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip :{
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    }

}, { strict: true });
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;