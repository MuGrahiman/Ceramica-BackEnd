const { ValidationError, NotFoundError, ConflictError } = require( '../../errors/customErrors' );
const { sendSuccessResponse } = require( '../../utilities/responses' );
const WishListService = require( './wishList.service' );

// Add to wishlist
exports.addToWishlist = async ( req, res ) => {
    const { productId } = req.body;

    if ( !productId ) {
        throw new ValidationError( 'Product ID is required to create a wishlist.' );
    }

    // Check if the product is already in the wishlist
    const existingWishlistItem = await WishListService.findWishlistItem( {
        userId: req.user.id,
        productId
    } );
    
    if ( existingWishlistItem ) {
        throw new ConflictError( 'Product is already in the wishlist.' );
    }

    // Add to wishlist
    const wishlistItem = await WishListService.addToWishlist( {
        userId: req.user.id,
        productId,
    } );

    sendSuccessResponse( res, {
        message: 'Product added to wishlist',
        data: wishlistItem,
    } );
};

// Remove from wishlist
exports.removeFromWishlist = async ( req, res ) => {
    const { productId } = req.body;

    if ( !productId ) {
        throw new ValidationError( 'Product ID is required to remove from wishlist.' );
    }

    // Remove from wishlist
    const deletedItem = await WishListService.removeFromWishlist( {
        userId: req.user.id,
        productId,
    } );

    if ( !deletedItem ) {
        throw new NotFoundError( 'Product not found in the wishlist.' );
    }

    sendSuccessResponse( res, {
        message: 'Product removed from wishlist',
        data: deletedItem,
    } );
};

// Get wishlist
exports.getWishlist = async ( req, res ) => {
    const wishlist = await WishListService.getWishlist( { user: req.user.id } );

    sendSuccessResponse( res, {
        message: 'Wishlist retrieved successfully',
        data: wishlist,
    } );
};