const mongoose = require( 'mongoose' );

const inventorySchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    shape: {
        type: String,
        required: true,
    },
    color: {
        name: {
            type: String,
            required: true,
        },
        hex: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    dimension: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    coverImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    images: [ {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    } ]
    ,
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
} );

const Inventory = mongoose.model( 'Inventory', inventorySchema );

module.exports = Inventory;
