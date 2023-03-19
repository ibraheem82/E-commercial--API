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
    // * This line of code queries the database using the Order model to retrieve all orders, with the user field populated with only the name property. The results are sorted by dateOrdered in descending order. The await keyword is used to indicate that this is an asynchronous operation and the code will wait for the result before continuing.
    // order from the newest to the oldest
  // * The lean() method is used to retrieve plain JavaScript objects instead of Mongoose documents, which can be more efficient if you don't need to modify or save the documents back to the database.
  const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1}).lean();

orderList.forEach(order => {
  const date = new Date(order.dateOrdered);
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate().toString();
  const suffix = getDaySuffix(day);
  order.dateOrdered = `${year} ${month} ${day}${suffix}`;
});

function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}
  

    // This block of code checks whether orderList is falsy, which would indicate that there was an error retrieving the orders from the database. If this is the case, it sends an error response with status code 500 and a JSON object with a success property set to false.
    if(!orderList) {
        res.status(500).json({success: false})
    } 
    // This sends a successful response with the orderList object retrieved from the database as the response body.
    res.send(orderList);
})


router.get(`/:id`, async (req, res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ 
        path: 'orderItems', populate: {
        path : 'product', populate: 'category'} 
        });

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
})



// This is a GET request for a specific order identified by its ID, 
// which is passed as a URL parameter (e.g. /orders/123)
// This route handles updating an order with a specific ID
router.put('/:id', async (req, res) => {
  // Find the order with the given ID and update its status field with the status provided in the request body.
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  // If no order was found with the given ID, return a 400 error.
  if (!order) return res.status(400).send('the order cannot be updated!');

  // If the update was successful, send back the updated order as the response.
  res.send(order);
});


// This route handles deleting an order with a specific ID
router.delete('/:id', (req, res) => {
  // Find the order with the given ID and remove it from the database
  Order.findByIdAndRemove(req.params.id).then(async order => {
    // If the order was found, remove all associated orderItems from the database
    if (order) {
      await order.orderItems.map(async orderItem => {
        await OrderItem.findByIdAndRemove(orderItem);
      });
      // Send a success response with a message indicating that the order was deleted
      return res.status(200).json({ success: true, message: 'the order is deleted!' });
    } else {
      // If no order was found with the given ID, send a 404 error response
      return res.status(404).json({ success: false , message: 'order not found!' });
    }
  }).catch(err => {
    // If there was an error during the database operation, send a 500 error response with details about the error
    return res.status(500).json({ success: false, error: err });
  });
});







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