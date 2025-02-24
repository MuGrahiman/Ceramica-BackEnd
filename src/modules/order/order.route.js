// order.route.js
const asyncHandler = require( "express-async-handler" );
const express = require( "express" );
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getOrdersByUser,
    updateOrderStatus,
    capturePayment
} = require( "./order.controller" );
const verifyToken = require( '../../middlewares/verifyToken' );

router.post( "/create-order", verifyToken, asyncHandler( createOrder ) );
router.post( "/capture-order", verifyToken, asyncHandler( capturePayment ) );

router.put( "/update/:id", verifyToken, asyncHandler( updateOrderStatus ) );
router.get( "/get/:id", verifyToken, asyncHandler( getOrderById ) ); 
router.get( "/get", verifyToken, asyncHandler( getOrdersByUser ) );

module.exports = router;
