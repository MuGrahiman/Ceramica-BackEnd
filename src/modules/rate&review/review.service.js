const {
    ValidationError,
    ConflictError,
    NotFoundError,
    UnauthorizedError
} = require( '../../errors/customErrors' );
const { validateMongoId } = require( '../../utilities/auth' );
const ReviewRepository = require( './review.repository' );

class ReviewService {
    static async getProductReviews ( productId ) {
        validateMongoId( productId, 'Invalid product ID' )

        return ReviewRepository.getProductReviews( productId );
    }

    static async addReview ( userId, productId, rating, review ) {

        validateMongoId( userId, 'Invalid user ID' )
        validateMongoId( productId, 'Invalid product ID' )

        if ( rating < 1 || rating > 5 ) {
            throw new ValidationError( 'Rating must be between 1 and 5' );
        }

        const existingReview = await ReviewRepository.getUserReview( userId, productId );
        if ( existingReview ) {
            throw new ConflictError( 'User already reviewed the product' );
        }

        return ReviewRepository.createReview( { userId, productId, rating, review } );
    }

    static async updateUserReview ( userId, reviewId, updateData ) {
        validateMongoId( userId, 'Invalid user ID' )
        validateMongoId( reviewId, 'Invalid review ID' )

        if ( updateData.rating && ( updateData.rating < 1 || updateData.rating > 5 ) ) {
            throw new ValidationError( 'Rating must be between 1 and 5' );
        }

        const review = await ReviewRepository.getReviewById( reviewId );
        if ( !review ) throw new NotFoundError( 'Review not found' );
        if ( review.userId.toString() !== userId.toString() ) {
            throw new UnauthorizedError( 'User not authorized to update review' );
        }

        return ReviewRepository.updateReview( reviewId, updateData );
    }

    static async deleteUserReview ( userId, reviewId ) {
        validateMongoId( userId, 'Invalid user ID' )
        validateMongoId( reviewId, 'Invalid review ID' )

        const review = await ReviewRepository.getReviewById( reviewId );
        if ( !review ) throw new NotFoundError( 'Review not found' );
        if ( review.userId.toString() !== userId.toString() ) {
            throw new UnauthorizedError( 'User not authorized to delete review' );
        }

        return ReviewRepository.deleteReview( reviewId );
    }

    static async getProductRatingStats ( productId ) {

        validateMongoId( productId, 'Invalid product ID' )

        const average = await ReviewRepository.getAverageRating( productId );
        const reviews = await ReviewRepository.getProductReviews( productId );
        return { average, count: reviews.length };
    }

}

module.exports = ReviewService;