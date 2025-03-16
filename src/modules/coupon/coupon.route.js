const express = require( 'express' );
const asyncHandler = require( 'express-async-handler' );
const verifyToken = require( '../../middlewares/verify.Token.Middleware' );
const {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    updateCouponStatus,
    deleteCoupon, checkCouponCode
} = require( './coupon.controller' );
const verifyAdmin = require( '../../middlewares/verify.Admin.Middleware' );
const router = express.Router();

router.use( verifyToken );
router.post( '/check/:code', asyncHandler( checkCouponCode ) );
router.use( verifyAdmin );
router.get( '/get', asyncHandler( getCoupons ) );
router.get( '/get/:id', asyncHandler( getCoupon ) );
router.post( '/create', asyncHandler( createCoupon ) );
router.route( '/update/:id' )
    .put( asyncHandler( updateCoupon ) )
    .patch( asyncHandler( updateCouponStatus ) );
router.delete( '/delete/:id', asyncHandler( deleteCoupon ) );

module.exports = router;