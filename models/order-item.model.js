const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    /*
    * type: mongoose.Schema.Types.ObjectId: This line specifies that the "product" field should store a MongoDB ObjectId, which is a unique identifier used to reference documents in a collection. In other words, the "product" field will store the _id of a related document in another collection.

    */
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);