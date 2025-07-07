const { createObjectId } = require( '../../utilities/auth' );
const Review = require( './review.model' );

class ReviewRepository {
    static async createReview ( reviewData ) {
        return Review.create( reviewData );
    }

    static async getProductReviews ( productId ) {
        return Review.find( { productId } )
            .populate( 'userId' )
            .sort( { createdAt: -1 } );
    }

    static async getUserReview ( userId, productId ) {
        return Review.findOne( { userId, productId } );
    }

    static async getReviewById ( reviewId ) {
        return Review.findById( reviewId );
    }

    static async updateReview ( reviewId, updateData ) {
        return Review.findByIdAndUpdate(
            reviewId,
            updateData,
            { new: true, runValidators: true }
        );
    }

    static async deleteReview ( reviewId ) {
        return Review.findByIdAndDelete( reviewId );
    }

    static async getAverageRating ( productId = '' ) {
        const id = createObjectId( productId );
        const aggregateResult = await Review.aggregate( [
            { $match: { productId: id } },
            { $group: { _id: null, average: { $avg: '$rating' } } }
        ] );
        return aggregateResult[ 0 ]?.average || 0;
    }


    
}

module.exports = ReviewRepository;