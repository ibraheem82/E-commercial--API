const { Product } = require('../models/product.model');
const express = require('express');
const { Category } = require('../models/category.model');
const User = require('../models/user');
// * router
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

/*
* -> This code block initializes a multer instance and sets its storage and upload options. Multer is a middleware for handling multipart/form-data, which is typically used for uploading files.

* -> The diskStorage function is called to set the destination and filename of the uploaded file. It takes an object with two properties as an argument.

* -> The destination property specifies the directory where the uploaded file will be stored. The cb (callback) function is called once the directory has been set. If an error occurs during file validation, an error is created and passed to the cb function, along with the directory where the file should be stored. Otherwise, null is passed as the error parameter, and the directory is still passed as the second argument.

* -> The filename property specifies the name of the uploaded file. The cb function is called once the name has been set. It takes the req, file, and cb parameters. The file's original name is modified to replace spaces with hyphens, and the file's extension is determined from its mimetype. The final filename is a concatenation of the modified name, the current timestamp, and the file extension.

* -> Finally, uploadOptions is initialized with the storage object. It can be used with an HTTP POST request to upload files to the server.
*/


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });


// http://localhost:3000/api/v1/products
router.get(`/`, async(req, res) => {
  // [.select('name image')] -> use for selecting exactly what you want.
  // [-_id] -> To exclude something from the database.
  // const productList = await Product.find().select('name image -_id');

  // ! Forcing the api to have categories, it must have categories.
  // if it is empty it will get all the fields
  let filter = {}
//   This code block checks if the request has a categories query parameter. If it does, the code splits the value of the categories parameter by commas (,) into an array and sets it as the value of the category property in the filter object.

// For example, if the URL for the request is http://example.com/products?categories=shoes,clothing, then req.query.categories will be the string 'shoes,clothing', and filter will be set to { category: ['shoes', 'clothing'] }.

// If the categories query parameter is not present in the request, the filter object remains an empty object.
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') }
  }
  // const productList = await Product.find().populate('category');
//   This line uses the Mongoose library to query the database for products that match the filter criteria defined in the filter object. The Product model is assumed to be defined elsewhere in the code.

// The populate method is used to populate the category field of each product with the full category object instead of just its ID. This assumes that there is a Category model in the database and that the Product model has a reference to it through a category field.

// Overall, this code allows clients to filter the list of products returned by the server based on the category or categories they specify in the query parameter. If no category is specified, the server returns all products.
  const productList = await Product.find(filter).populate('category');

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
    const findID = req.params.id
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