// cart.route.js
const express = require( 'express' );
const asyncHandler = require( "express-async-handler" );
const verifyToken = require( '../../middlewares/verifyToken' );
const { addToCart, removeFromCart, updateCartItem, getCart } = require( './cart.controller' );
const router = express.Router();

router.get( '/get', verifyToken, asyncHandler( getCart ) );
router.post( '/add', verifyToken, asyncHandler( addToCart ) );
router.patch( '/update', verifyToken, asyncHandler( updateCartItem ) );
router.delete( '/remove', verifyToken, asyncHandler( removeFromCart ) );

module.exports = router;  
