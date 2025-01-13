// controllers/cartController.js
const Cart = require( './cart.model' );
const Product = require( '../inventory/inventory.model' );
// const { body, validationResult } = require( 'express-validator' );

// Add item to cart
const addToCart = async ( req, res ) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Check if product exists
        const product = await Product.findById( productId );
        if ( !product ) return res.status( 404 ).json( { message: 'Product not found' } );

        let cart = await Cart.findOne( { userId } );

        if ( !cart ) return res.status( 404 ).json( { message: 'Cart not found' } );
        else {
            const existingItem = cart.items.find( item => item.productId.toString() === productId );
            if ( existingItem ) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push( { productId, quantity } );
            }
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status( 201 ).json( { message: 'Item added to cart successfully', cart } );
    } catch ( error ) {
        console.error( `[CartController] Error: ${ error.message }` );
        res.status( 500 ).json( { error: 'Failed to add item to cart', details: error.message } );
    }
};

// Get user's cart
const getCart = async ( req, res ) => {
    const { user_id } = req.params;

    try {
        const cart = await Cart.findOne( { user_id } ).populate( 'items.product_id' );
        if ( !cart ) return res.status( 404 ).json( { message: 'Cart not found' } );

        res.json( cart );
    } catch ( error ) {
        res.status( 500 ).json( { success: false, error: error.message } );
    }
};

// Remove item from cart
const removeFromCart = async ( req, res ) => {
    const { user_id, product_id } = req.params;

    try {
        const cart = await Cart.findOne( { user_id } );
        if ( !cart ) return res.status( 404 ).json( { message: 'Cart not found' } );

        cart.items = cart.items.filter( item => item.product_id.toString() !== product_id );
        cart.updated_at = Date.now();
        await cart.save();

        res.json( { message: 'Item removed from cart' } );
    } catch ( error ) {
        res.status( 500 ).json( { success: false, error: error.message } );
    }
};

// Update item quantity
const updateCartItem = async ( req, res ) => {
    const { user_id, product_id } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne( { user_id } );
        if ( !cart ) return res.status( 404 ).json( { message: 'Cart not found' } );

        const existingItem = cart.items.find( item => item.product_id.toString() === product_id );
        if ( existingItem ) {
            existingItem.quantity = quantity;
            cart.updated_at = Date.now();
            await cart.save();

            return res.json( { message: 'Item quantity updated' } );
        } else {
            return res.status( 404 ).json( { message: 'Item not found in cart' } );
        }
    } catch ( error ) {
        res.status( 500 ).json( { success: false, error: error.message } );
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItem
};
