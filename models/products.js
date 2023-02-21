const mongoose = require('mongoose');



const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInstock:Number
})


// * Model -> Schema
// matching the schema to it model
exports.Product = mongoose.model('Product', productSchema);