

# 🛒🛍 E-commerce  API Application

# eCommerce Web API

This is a web API for an eCommerce website built with Node.js, Express, and MongoDB.

## Installation

To install this project, follow these steps:

1. Clone this repository
2. Install dependencies by running `npm install`
3. Create a `.env` file in the root directory and set the following environment variables:

4. Start the server by running `npm start`

## Usage

### API Routes

## ROUTES TO IMPLEMENT
| METHOD | ROUTE | FUNCTIONALITY |ACCESS|
| ------- | ----- | ------------- | ------------- |
| *POST* | ```/api/v1/users``` | _Register new user_| _All users_|
| *POST* | ```/api/v1/users/login``` | _Get the access token_|_All users_|
| *POST* | ```/api/v1/orders``` | _Order products_|_All users_|
| *POST* | ```/auth/jwt/verify/``` | _Verify the validity of a token_|_All users_|
| *POST* | ```/orders/``` | _Place an order_|_All users_|
| *POST* | ```/orders/``` | _Get all orders_|_All users_|
| *GET* | ```/order/{order_id}/``` | _Retrieve an order_|_Superuser_|
| *PUT* | ```/orders/{order_id}/``` | _Update an order_|_All users_|
| *PUT* | ```/update-status/{order_id}/``` | _Update order status_|_Superuser_|
| *DELETE* | ```/delete/{order_id}/``` | _Delete/Remove an order_ |_All users_|
| *GET* | ```/user/{user_id}/orders/``` | _Get user's orders_|_All users_|
| *GET* | ```/user/{user_id}/order/{order_id}/``` | _Get user's specific order_|
| *GET* | ```/docs/``` | _View API documentation_|_All users_|


#### `GET /api/categories`

This route returns a list of all product categories.

#### `GET /api/categories/:id`

This route returns a single product category by ID.

#### `POST /api/categories`

This route creates a new product category.

#### `PUT /api/categories/:id`

This route updates a product category by ID.

#### `DELETE /api/categories/:id`

This route deletes a product category by ID.

#### `GET /api/products`

This route returns a list of all products.

#### `GET /api/products/:id`

This route returns a single product by ID.

#### `POST /api/products`

This route creates a new product.

#### `PUT /api/products/:id`

This route updates a product by ID.

#### `DELETE /api/products/:id`

This route deletes a product by ID.

#### `POST /api/users`

This route creates a new user.

#### `POST /api/users/login`

This route logs in a user.

#### `GET /api/v1/users`

This route returns all the users.

#### `GET /api/orders`

This route returns a list of all orders.

#### `GET /api/orders/:id`

This route returns a single order by ID.

#### `POST /api/orders`

This route creates a new order.

### Middlewares

#### `bodyParser.json()`

This middleware parses incoming JSON data.

#### `morgan('tiny')`

This middleware logs incoming HTTP requests.

#### `authJwt()`

This middleware authenticates JSON Web Tokens (JWTs) sent in the request headers.

#### `errorHandler()`

This middleware handles errors thrown by the application.

### Database

This project uses MongoDB as the database. The database connection string is stored in the `.env` file.

### Routers

This project uses the following routers:

- `categories.router.js`
- `products.router.js`
- `users.router.js`
- `orders.router.js`

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork this repository
2. Create a new branch (`git checkout -b new-feature`)
3. Make your changes and commit them (`git commit -am "Add new feature"`)
4. Push to the branch (`git push origin new-feature`)
5. Create a pull request

## License

This project is


