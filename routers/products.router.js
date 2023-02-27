const { Product } = require('../models/product.model');
const express = require('express');
const { Category } = require('../models/category.model');
// * router
const router = express.Router();
const mongoose = require('mongoose');


// http://localhost:3000/api/v1/products
router.get(`/`, async(req, res) => {
  // [.select('name image')] -> use for selecting exactly what you want.
  // [-_id] -> To exclude something from the database.
  // const productList = await Product.find().select('name image -_id');
  const productList = await Product.find().populate('category');

  if (!productList) {
    res.status(500).json({success:false})
  }
  res.send(productList);
})

router.get(`/:id`, async (req, res) => {
//    .populate('category') is a method that is called on the result of Product.findById(req.params.id).

// .populate() is a Mongoose method used for populating reference fields in a document. In the context of the code you provided, it is used to populate the category field of the product document.

// The category field in the product document is likely a reference to another document (i.e. a category document), and the populate method is used to retrieve the referenced category document and replace the category field in the product document with the category document.

// The result of calling .populate() on the product document is that the category field in the product document will now contain the actual category document, rather than just its ID. This can be useful when working with related data in Mongoose and can simplify querying and manipulation of related data.
  // [.populate()] -> Means any connected ID or field to another table of collection will be displayed as detail in this field, Specifies paths which should be populated with other documents.
  const product = await Product.findById(req.params.id).populate('category')
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

// * Update Product
router.put('/:id', async (req, res) => {
  // ! if it is not valid it will return error
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid Product Id')
  }
   const category = await Category.findById(req.body.category)

  if (!category) return res.status(400).send('Invalid Category');
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
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
        },
// new updated data will be returned
        {new : true}
    )

    if (!product)
        return res.status(404).send('The product cannot be updated')
// * if there is category
    res.send(product)
})


router.delete('/:id', (req, res) => {
    // * will find and delete by ID
    const findID = breq.params.id
    Product.findByIdAndRemove(findID).then(product => {
        if (product) {
            return res.status(200).json({
                success: true,
                message: `The product with the ID ~ ${findID} ~ was deleted.`
            })
        } else {
            return res.status(404).json({
                success: false,
                message: `Product with the ID ~ ${findID} ~ not found.`
            });
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})

router.get(`/get/count`, async(req, res) => {
  // It will return the product count.
  // const productCount = await Product.countDocuments((count) => count)
  const productCount = await Product.countDocuments({});
  if (!productCount) {
    res.status(500).json({success:false})
  }
  res.send({
    productCount:productCount
  });
})



router.get(`/get/featured/:count`, async(req, res) => {
  // will get by the number that we pass inside the parameter.
  const count = req.params.count ? req.params.count : 0;
  const featuredProducts = await Product.find({
    isFeatured: true
  }).limit(+count)
  if (!featuredProducts) {
    res.status(500).json({success:false})
  }
  res.send(featuredProducts)
})


module.exports = router