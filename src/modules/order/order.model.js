const mongoose = require( "mongoose" );
const { PAYMENT_STATUS } = require( "../../utilities/constants" );



const orderSchema = new mongoose.Schema( {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
        type: String,
        enum: Object.values( PAYMENT_STATUS ),
        default: PAYMENT_STATUS.CREATED,
        required: true,
    },
    paymentId: { type: String },
    status: {
        type: String,
        enum: [ "processing", "shipped", "delivered", "cancelled" ],
        default: "processing",
        required: true,
    },
}, { timestamps: true } );

module.exports = mongoose.model( "Order", orderSchema );