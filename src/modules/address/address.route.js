// routes/address.route.js
const express = require( 'express' );
const asyncHandler = require( 'express-async-handler' );
const verifyToken = require( '../../middlewares/verify.Token.Middleware' );
const {
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getAddresses,
} = require( './address.controller' );

const router = express.Router();

router.post( '/add', verifyToken, asyncHandler( addAddress ) );

router.route( '/update/:id' )
    .put( verifyToken, asyncHandler( updateAddress ) )
    .patch( verifyToken, asyncHandler( setDefaultAddress ) );

router.delete( '/delete', verifyToken, asyncHandler( deleteAddress ) );


router.get( '/get', verifyToken, asyncHandler( getAddresses ) );

module.exports = router;