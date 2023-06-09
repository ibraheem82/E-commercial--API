const mongoose = require('mongoose');



const productSchema = mongoose.Schema({
  // _id: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },

  name: {
    type: String,
    required:true,
  },


  description: {
    type: String,
    required:true
  },

  fullDescription: {
  type: String,
    default:''
  },


  image: {
    type: String,
    default:''
  },
  

  images: [{
  type: String,
  }],


  brands: {
    type: String,
    default:''
  },

  price: {
    type: Number,
    default:0
  },

  category: {
    // the object will be connected to the category schema.
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
    required:true
  },

  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max:400,
  },

  rating: {
    type: Number,
    default:0,
  },

  numReviews: {
    type: Number,
    default:0,
  },

  isFeatured: {
    type: Boolean,
    default:false,
  },

  dateCreated: {
    type: Date,
    default:Date.now
  }
})

// // * making sure that all products must have their own ID's
// productSchema.pre('save', function(next) {
//   if (!this._id) {
//     // Generate a unique ID based on the product name and category name
//     const id = `${this.name}-${this.category.name}`.toLowerCase();
//     this._id = id;
//   }
//   next();
// });

// * To change "_id" key to "id" in a more user friendly way.
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
});

// * Model -> Schema
// matching the schema to it model
exports.Product = mongoose.model('Product', productSchema);