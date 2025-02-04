// wishlist.route.js
const express = require( "express" );
const asyncHandler = require( "express-async-handler" );

const { addToWishlist, removeFromWishlist, getWishlist } = require( "./wishList.controller" );
const verifyToken = require( "../../middlewares/verifyToken" );
const router = express.Router();

router.post( '/add', verifyToken, asyncHandler( addToWishlist ) );
router.delete( '/remove', verifyToken, asyncHandler( removeFromWishlist ) );
router.get( '/get',verifyToken, asyncHandler( getWishlist ) );

module.exports = router;
