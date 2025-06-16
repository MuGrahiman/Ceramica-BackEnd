const express = require( 'express' );
const router = express.Router();
const asyncHandler = require( 'express-async-handler' );
const verifyToken = require( '../../middlewares/verify.Token.Middleware' );
const {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getProductRatingStats
} = require( './review.controller' );

// Public routes
router.get( '/:productId', asyncHandler( getProductReviews ) );
router.get( '/:productId/stats', asyncHandler( getProductRatingStats ) );

// Protected routes
router.use( verifyToken );
router.post( '/add', asyncHandler( addReview ) );
router.put( '/edit/:reviewId', asyncHandler( updateReview ) );
router.delete( '/delete/:reviewId', asyncHandler( deleteReview ) );

module.exports = router;