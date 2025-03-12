const express = require( "express" );

// Import all routes
const bookRoutes = require( "../modules/books/book.route" );
const otpRoutes = require( "../modules/otp/otp.route" );
const userRoutes = require( "../modules/users/user.route" );
const adminRoutes = require( "../modules/admin/admin.route" );
const inventoryRoutes = require( "../modules/inventory/inventory.route" );
const wishListRoutes = require( "../modules/wishList/wishList.route" );
const cartRoutes = require( "../modules/cart/cart.route" );
const addressRoutes = require( "../modules/address/address.route" );
const orderRoutes = require( "../modules/order/order.route" );
const couponRoutes = require( "../modules/coupon/coupon.route" );

const router = express.Router();

// Define API routes
router.use( "/books", bookRoutes );
router.use( "/otp", otpRoutes );
router.use( "/auth", userRoutes );
router.use( "/admin", adminRoutes );
router.use( "/inventory", inventoryRoutes );
router.use( '/wishlist', wishListRoutes );
router.use( '/cart', cartRoutes );
router.use( '/address', addressRoutes );
router.use( "/order", orderRoutes );
router.use( "/coupon", couponRoutes );


module.exports = router;
