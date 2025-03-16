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
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }, // Reference Payment model
    status: {
        type: String,
        enum: [ "processing", "shipped", "delivered", "cancelled" ],
        default: "processing",
        required: true,
    },
}, { timestamps: true } );

module.exports = mongoose.model( "Order", orderSchema );