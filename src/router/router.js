const express = require( "express" );

// Import all routes
const bookRoutes = require( "../modules/books/book.routes" );
const otpRoutes = require( "../modules/otp/otp.routes" );
const userRoutes = require( "../modules/user/user.routes" );
const adminRoutes = require( "../modules/admin/admin.routes" );
const inventoryRoutes = require( "../modules/inventory/inventory.routes" );
const wishListRoutes = require( "../modules/wishList/wishList.routes" );
const cartRoutes = require( "../modules/cart/cart.routes" );
const addressRoutes = require( "../modules/address/address.routes" );
const orderRoutes = require( "../modules/order&payment/order.routes" );
const couponRoutes = require( "../modules/coupon/coupon.routes" );
const inquiryRoutes = require( "../modules/inquiry/inquiry.routes" );

const router = express.Router();

// Define API routes
router.use( "/books", bookRoutes );
router.use( "/otp", otpRoutes );
router.use( "/admin", adminRoutes );
router.use( "/auth", userRoutes );
router.use( "/inventory", inventoryRoutes );
router.use( '/wishlist', wishListRoutes );
router.use( '/cart', cartRoutes );
router.use( '/address', addressRoutes );
router.use( "/order", orderRoutes );
router.use( "/coupon", couponRoutes );
router.use( "/inquiry", inquiryRoutes );


module.exports = router;
