const asyncHandler = require( 'express-async-handler' );
const { sendSuccessResponse } = require( '../../utilities/responses' );
const ReviewService = require( './review.service' );

exports.addReview = asyncHandler( async ( req, res ) => {
    const { productId, rating, review } = req.body;

    const newReview = await ReviewService.addReview(
        req.user.id,
        productId,
        rating,
        review
    );
    sendSuccessResponse( res, {
        statusCode: 201,
        message: 'Review added successfully',
        data: newReview
    } );
} );

exports.getProductReviews = asyncHandler( async ( req, res ) => {
    const reviews = await ReviewService.getProductReviews( req.params.productId );
    sendSuccessResponse( res, {
        message: 'Reviews fetched successfully',
        data: reviews
    } );
} );

exports.updateReview = asyncHandler( async ( req, res ) => {
    const updatedReview = await ReviewService.updateUserReview(
        req.user.id,
        req.params.reviewId,
        req.body
    );
    sendSuccessResponse( res, {
        message: 'Review updated successfully',
        data: updatedReview
    } );
} );

exports.deleteReview = asyncHandler( async ( req, res ) => {
    await ReviewService.deleteUserReview( req.user.id, req.params.reviewId );
    sendSuccessResponse( res, {
        message: 'Review deleted successfully'
    } );
} );

exports.getProductRatingStats = asyncHandler( async ( req, res ) => {
    const stats = await ReviewService.getProductRatingStats( req.params.productId );
    sendSuccessResponse( res, {
        message: 'Rating stats fetched successfully',
        data: stats
    } );
} );

