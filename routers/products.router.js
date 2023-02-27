const { Product } = require('../models/product.model');
const express = require('express');
const { Category } = require('../models/category.model');
// * router
const router = express.Router();

// http://localhost:3000/api/v1/products
router.get(`/`, async(req, res) => {
  // [.select('name image')] -> use for selecting exactly what you want.
  // [-_id] -> To exclude something from the database.
  const productList = await Product.find().select('name image -_id');

  if (!productList) {
    res.status(500).json({success:false})
  }
  res.send(productList);
})

router.get(`/:id`, async(req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({success:false})
  }
  res.send(product);
})


router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category)

  if (!category) return res.status(400).send('Invalid Category');

  // receive product from the frontend
  const product = new Product({
    name: req.body.name,
    description: req.body.image,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock:req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  })

//  * A new product is created after saving it.
  productSave = await product.save();

  if (!product)
    return res.status(500).send('The product cannot be created')
  
  res.send(product);
})

module.exports = router