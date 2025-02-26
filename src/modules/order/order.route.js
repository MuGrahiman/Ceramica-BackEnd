// order.route.js
const asyncHandler = require( "express-async-handler" );
const express = require( "express" );
const router = express.Router();
const verifyToken = require( '../../middlewares/verifyToken' );
const {
    createOrder,
    getOrderById,
    getOrdersByUser,
    updateOrderStatus,
    capturePayment,
    getOrderPaymentDetails
} = require( "./order.controller" );

router.post( "/create-order", verifyToken, asyncHandler( createOrder ) );
router.post( "/capture-order", verifyToken, asyncHandler( capturePayment ) );
router.get( "/payment/:id", verifyToken, asyncHandler( getOrderPaymentDetails ) );

router.put( "/update/:id", verifyToken, asyncHandler( updateOrderStatus ) );
router.get( "/get/:id", verifyToken, asyncHandler( getOrderById ) ); 
router.get( "/get", verifyToken, asyncHandler( getOrdersByUser ) );

module.exports = router;
