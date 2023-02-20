const express = require('express');
const app = express();

require('dotenv/config');

const api = process.env.API_URL



// http://localhost:3000/api/v1/products
app.get('/', (req, res) => {
  res.send('<h1>Omikunle</h1>');

})

app.listen(3000, () => {
  console.log('listening on port http://localhost:3000');
})