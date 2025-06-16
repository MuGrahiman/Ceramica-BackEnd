const mongoose = require( 'mongoose' );

const reviewSchema = new mongoose.Schema( {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        minlength: 50
    }
}, { timestamps: true } );

// Compound index to ensure one review per user per product
reviewSchema.index( { userId: 1, productId: 1 }, { unique: true } );

module.exports = mongoose.model( 'Review', reviewSchema );