const { default: mongoose } = require( 'mongoose' );
const couponModel = require( './coupon.model' );
const { ValidationError } = require( '../../errors/customErrors' );

const verifyMongoId = ( id ) => {
    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        throw new ValidationError( 'Invalid ID format' );
    }
    return id;
};

class CouponService {
    static async createCoupon ( data ) {
        const newCoupon = new couponModel( data );
        await newCoupon.save();
        return newCoupon;
    }

    static async getCoupons (query) {
        return await couponModel.find(query).sort({ createdAt: -1 });
    }

    static async findCoupon ( data ) {
        // verifyMongoId(data.id);
        return await couponModel.findOne( data ).populate( {
            path: 'redeemedBy',
            select: 'firstName lastName avatar'
        } );
    }

    static async updateCouponItem ( { couponId, data } ) {
        verifyMongoId( couponId );
        return await couponModel.findByIdAndUpdate(
            couponId,
            data,
            { new: true, runValidators: true }
        );
    }

    static async removeCoupon ( couponId ) {
        verifyMongoId( couponId );
        return await couponModel.findByIdAndDelete( couponId );
    }
}

module.exports = CouponService;