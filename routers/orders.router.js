/*
    This code creates a router for handling orders in an Express application. It first requires the Order and OrderItem models from the ../models directory and sets up the router with express.Router(). The router handles a POST request to create a new order. The request body should contain an array of orderItems with each item having a quantity and product ID. The request body should also include information about the shipping address, city, zip, country, phone, status, and user ID.

The function first extracts the orderItems from the request body and creates new OrderItem objects for each item in the array. It uses Promise.all() to create all OrderItem objects simultaneously and asynchronously. Once the OrderItem objects are created, the function maps over the array of orderItems to extract their IDs and returns them as an array of promises. It then resolves all these promises with await and stores the array of orderItem IDs in the orderItemsIdsResolved variable.

Next, the function calculates the total price of the order by multiplying the price of each OrderItem by its quantity. It does this using Promise.all() again to handle all the asynchronous operations at once. It maps over the array of orderItem IDs and retrieves the OrderItem from the database using the OrderItem.findById() method. It then populates the product field with the price of the Product model using the .populate() method. Finally, it calculates the total price of the OrderItem and returns it as a promise. Once all the promises are resolved, it reduces the array of total prices to a single sum.

Finally, the function creates a new Order object with all the necessary fields from the request body, including the orderItemsIdsResolved and totalPrice calculated earlier. It saves this new Order to the database using the .save() method and returns the new Order object if successful. If there is an error, it returns a 400 status code and a message indicating that the order could not be created
*/




// Import necessary modules
const {Order} = require('../models/order.model');
const { OrderItem } = require('../models/order-item.model');
const express = require('express');
const router = express.Router();

/*
* Overall, this function retrieves all orders from the database, populates the user field with only the name property, sorts the results by dateOrdered in descending order, and sends the resulting list of orders as a response.
*/
// This defines a new route for handling GET requests to the root of the router. When a GET request is made to this route, the function defined in the next lines will be executed.
router.get(`/`, async (req, res) => {
    // This line of code queries the database using the Order model to retrieve all orders, with the user field populated with only the name property. The results are sorted by dateOrdered in descending order. The await keyword is used to indicate that this is an asynchronous operation and the code will wait for the result before continuing.
    // order from the newest to the oldest
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});


    // This block of code checks whether orderList is falsy, which would indicate that there was an error retrieving the orders from the database. If this is the case, it sends an error response with status code 500 and a JSON object with a success property set to false.
    if(!orderList) {
        res.status(500).json({success: false})
    } 
    // This sends a successful response with the orderList object retrieved from the database as the response body.
    res.send(orderList);
})



// This is a GET request for a specific order identified by its ID, 
// which is passed as a URL parameter (e.g. /orders/123)
router.get(`/:id`, async (req, res) =>{

    // This line uses Mongoose's findById method to find the order with the ID
    // specified in the URL parameter. It returns a Promise that resolves to 
    // the order document from the database.
    const order = await Order.findById(req.params.id)
    
        // This line uses Mongoose's populate method to include the 'user' field
        // in the order document, and only include the 'name' property of the user document.
        .populate('user', 'name')

        // This line uses Mongoose's populate method to include the 'orderItems' field
        // in the order document, and also include the 'product' field for each item
        // and the 'category' field for each product. This is done by passing an object
        // with the 'path' property set to 'orderItems' and the 'populate' property
        // set to another object with the 'path' property set to 'product' and the 
        // 'populate' property set to 'category'.
        .populate({ 
            path: 'orderItems', populate: {
                path : 'product', populate: 'category'} 
        });

    // If no order was found, send a 500 error response with a JSON object
    // that has a 'success' property set to false.
    if(!order) {
        res.status(500).json({success: false})
    } 








// Define a route for creating an order
router.post('/', async (req,res)=>{
    // Create a Promise to save all order items
    // [orderItem] -> from the list things the user is sending.
    // using [Promise.all] because it is an array of promises.
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        // Create a new order item object from the request body
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        // Save the new order item to the database
        newOrderItem = await newOrderItem.save();

        // Return the ID of the newly created order item
        return newOrderItem._id;
    }))
    // Resolve all order item IDs
    const orderItemsIdsResolved =  await orderItemsIds;

    // Calculate the total price of all order items
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=> {
        // Find the order item by its ID and populate its associated product's price
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        // Calculate the total price of the order item
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    // Calculate the total price of the order
    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);

    // Create a new order object from the request body
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    // Save the new order to the database
    order = await order.save();

    // Return an error response if the order was not created
    if(!order)
    return res.status(400).send('the order cannot be created!')

    // Return the newly created order
    res.send(order);
})
module.exports =router;