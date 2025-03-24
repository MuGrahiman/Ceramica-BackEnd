const mongoose = require( "mongoose" );
const { PAYMENT_STATUS } = require( "../../utilities/constants" );

const paymentSchema = new mongoose.Schema( {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    paypalId: { type: String, required: true }, // PayPal Order ID
    payerId: {// Payer  ID
        type: String,
        required: function () {
            return this.status === PAYMENT_STATUS.COMPLETED;
        }
    },
    payerMail: { // Payer Mail ID
        type: String,
        required: function () {
            return this.status === PAYMENT_STATUS.COMPLETED;
        }
    },
    transactionId: { // PayPal Capture ID
        type: String,
        required: function () {
            return this.status === PAYMENT_STATUS.COMPLETED;
        }
    },
    amount: { 
        currencyCode: {
            type: String,
            required: function () {
                return this.status === PAYMENT_STATUS.COMPLETED;
            }
        },
        value: {
            type: String,
            required: function () {
                return this.status === PAYMENT_STATUS.COMPLETED;
            }
        },
    },
    status: {
        type: String,
        enum: Object.values( PAYMENT_STATUS ),
        default: PAYMENT_STATUS.CREATED,
        required: true,
    },
    createTime: {
        type: String,
        required: function () {
            return this.status === PAYMENT_STATUS.COMPLETED;
        }
    },
}, { timestamps: true } );

module.exports = mongoose.model( "Payment", paymentSchema );
