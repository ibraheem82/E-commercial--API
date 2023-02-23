const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const api = process.env.API_URL;




// * Middlewares
app.use(bodyParser.json())
app.use(morgan('tiny'))

// * Routers
const categoriesRoutes = require('./routers/categories.router');
const productsRoutes = require('./routers/products.router');
const usersRoutes = require('./routers/users.router');
const ordersRoutes = require('./routers/orders.router');



app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);



// * Database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
).then(() => console.log('DB connection was successfull'));

// * Server
app.listen(3000, () => {
  console.log('listening on port http://localhost:3000');
})
