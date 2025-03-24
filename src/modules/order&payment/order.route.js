// order.route.js
const asyncHandler = require( "express-async-handler" );
const express = require( "express" );
const router = express.Router();
const verifyToken = require( '../../middlewares/verify.Token.Middleware' );
const {
    createOrder,
    // getOrderById,
    getOrdersForUser,
    updateOrderStatus,
    capturePayment,
    getOrderPaymentDetails,
    getOrdersForAdmin,
    getOrderById
} = require( "./order.controller" );
const verifyAdmin = require( "../../middlewares/verify.Admin.Middleware" );

router.use( verifyToken );

router.post( "/create-order", asyncHandler( createOrder ) );
router.post( "/capture-order", asyncHandler( capturePayment ) );
router.get( "/payment/:id", asyncHandler( getOrderPaymentDetails ) );

router.patch( "/status/:id", asyncHandler( updateOrderStatus ) );
router.get( "/get/client", asyncHandler( getOrdersForUser ) );
router.get( "/get/admin",verifyAdmin, asyncHandler( getOrdersForAdmin ) );
router.get( "/get/:id", asyncHandler( getOrderById ) );

module.exports = router;
