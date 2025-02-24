const { NotFoundError, ValidationError } = require( '../../errors/customErrors' );
const { sendSuccessResponse } = require( '../../utilities/responses' );
const CartService = require( './cart.service' );

// Add to cart
exports.addToCart = async ( req, res ) => {
    const { productId, quantity } = req.body;

    if ( !productId ) {
        throw new ValidationError( 'Product ID is required to add to cart.' );
    }
    if ( !quantity ) {
        throw new ValidationError( 'Quantity is required to add to cart.' );
    }

    // Check if the product is already in the cart
    const existingCartItem = await CartService.findCartItem( { userId: req.user.id, productId } );
    let cartItem;
    if ( existingCartItem ) {
        const updatedQuantity = existingCartItem.quantity + quantity;
        cartItem = await CartService.updateCartItem( { userId: req.user.id, productId, quantity: updatedQuantity } );
    } else {
        cartItem = await CartService.addToCart( { userId: req.user.id, productId, quantity } );
    }

    sendSuccessResponse( res, {
        message: 'Product added to cart',
        data: cartItem,
    } );
};

// Remove from cart
exports.removeFromCart = async ( req, res ) => {
    const { cartId } = req.body;

    if ( !cartId ) {
        throw new ValidationError( 'Cart ID is required to remove from cart.' );
    }

    const deletedItem = await CartService.removeFromCart( cartId );
    if ( !deletedItem ) {
        throw new NotFoundError( 'Cart item not found.' );
    }

    sendSuccessResponse( res, {
        message: 'Cart item removed successfully',
        data: deletedItem,
    } );
};

// Update cart item
exports.updateCartItem = async ( req, res ) => {
    const { productId, quantity } = req.body;

    if ( !productId ) {
        throw new ValidationError( 'Product ID is required to update cart.' );
    }
    if ( !quantity ) {
        throw new ValidationError( 'Quantity is required to update cart.' );
    }

    const cartItem = await CartService.updateCartItem( { userId: req.user.id, productId, quantity } );
    if ( !cartItem ) {
        throw new NotFoundError( 'Cart item not found.' );
    }

    sendSuccessResponse( res, {
        message: 'Cart updated',
        data: cartItem,
    } );
};

// Get cart
exports.getCart = async ( req, res ) => {
    const cart = await CartService.getCart( { user: req.user.id } );

    sendSuccessResponse( res, {
        message: 'Cart retrieved successfully',
        data: cart,
    } );
};

// Remove from cart
exports.clearCart = async ( req, res ) => {
    const userId = req.user._id;


    if ( !userId ) {
        throw new ValidationError( 'user ID is required to remove from cart.' );
    }

    const deletedItem = await CartService.deleteAllCartItems( userId );
    if ( !deletedItem || !deletedItem.acknowledged ) {
        throw new NotFoundError( 'Cart item not found.' );
    }

    sendSuccessResponse( res, {
        message: 'Cart item removed successfully',
        data: deletedItem,
    } );
};