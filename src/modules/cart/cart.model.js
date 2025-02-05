// models/Cart.js
const mongoose = require( 'mongoose' );

const CartSchema = new mongoose.Schema( {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    }
}, { timestamps: true } );


module.exports = mongoose.model( 'Cart', CartSchema );
