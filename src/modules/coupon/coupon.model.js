const mongoose = require('mongoose');
const { COUPON_STATUS } = require('../../utilities/constants');

const couponSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true,
    },
    couponCode: { 
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    validFrom: { 
        type: Date,
        required: true
    },
    validUntil: { 
        type: Date,
        required: true
    },
    minimumPurchaseAmount: { 
        type: Number,
        required: true,
        min: 0
    },
    discount: { 
        type: Number,
        required: true,
        min: 0
    },
    usageLimit: { 
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
    },
    redeemedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    status: {
        type: String,
        enum: Object.values(COUPON_STATUS),
        default: COUPON_STATUS.ACTIVE
    },
}, {
    timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
