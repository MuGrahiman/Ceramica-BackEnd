const express = require( "express" );

// Import all routes
const bookRoutes = require( "../modules/books/book.route" );
const cartRoutes = require( "../modules/cart/cart.route" );
const orderRoutes = require( "../modules/order/order.route" );
const otpRoutes = require( "../modules/otp/otp.route" );
const userRoutes = require( "../modules/users/user.route" );
const adminRoutes = require( "../modules/admin/admin.route" );
const inventoryRoutes = require( "../modules/inventory/inventory.route" );
const wishListRoutes = require( "../modules/wishList/wishList.route" );
const addressRoutes = require( "../modules/address/address.route" );
// const stripeRoutes = require( "../modules/stripe/stripe.route" );
const { BadRequestError } = require( "../errors/customErrors" );

const router = express.Router();

// Define API routes
router.use( "/books", bookRoutes );
router.use( "/order", orderRoutes );
router.use( "/otp", otpRoutes );
router.use( "/auth", userRoutes );
router.use( "/admin", adminRoutes );
router.use( "/inventory", inventoryRoutes );
router.use( '/cart', cartRoutes );
router.use( '/wishlist', wishListRoutes );
router.use( '/address', addressRoutes );
// router.use( '/stripe', stripeRoutes );

// Catch-all route for unmatched requests
router.use( ( req, res, next ) => {
    const error = new BadRequestError( "Not found the url" );
    next( error );
} );


module.exports = router;
