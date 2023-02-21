const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { json } = require('express');

dotenv.config({ path: './config.env' });

const api = process.env.API_URL;
// * Middlewares
app.use(bodyParser.json())
app.use(morgan('tiny'))

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInstock:Number
})

// * Model -> Schema
// matching the schema to it model
const Product = mongoose.model('Product', productSchema);


// http://localhost:3000/api/v1/products
app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 90,
    name: 'Toyota',
    images: 'homees'
  }
  res.send(product);
})


app.post(`${api}/products`, (req, res) => {
  // receive product from the frontend
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInstock: req.body.countInstock
  })

  // * save in the database
  product.save().then((createdProduct => {
    res.status(201).json(createdProduct)

  })).catch((err) => {
    res.status(500).json({
      error: err,
      success: false
    })
  })
  // console.log(newProduct);
})



mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
).then(() => console.log('DB connection was successfull'));

app.listen(3000, () => {
  console.log('listening on port http://localhost:3000');
})