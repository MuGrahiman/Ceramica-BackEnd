const { NotFoundError, ValidationError } = require( '../../errors/customErrors' );
const { generateCouponCode } = require( '../../utilities/auth' );
const { COUPON_STATUS } = require( '../../utilities/constants' );
const { sendSuccessResponse } = require( '../../utilities/responses' );
const CouponService = require( './coupon.service' );

exports.createCoupon = async ( req, res ) => {
    const { title,
        validFrom,
        validUntil,
        minimumPurchaseAmount,
        discount,
        usageLimit,
        status,
        description,
    } = req.body;

    if (
        !title ||
        !validFrom ||
        !validUntil ||
        !minimumPurchaseAmount ||
        !discount ||
        !usageLimit ||
        !status ||
        !description
    ) {
        throw new ValidationError( 'Invalid Data' );
    }
    const uniqueCouponCode = async ( length = 6 ) => {

        const couponCode = await generateCouponCode( length );
        // Check if the coupon code already exists
        const existingCoupon = await CouponService.findCoupon( { couponCode } );
        if ( !existingCoupon ) {
            return couponCode
        }
        return uniqueCouponCode( length )
    }

    const couponCode = await uniqueCouponCode();
    const newCoupon = await CouponService.createCoupon( {
        couponCode,
        title,
        validFrom,
        validUntil,
        minimumPurchaseAmount,
        discount,
        usageLimit,
        status,
        description,
    } );

    sendSuccessResponse( res, {
        message: 'Coupon created successfully.',
        data: newCoupon,
    } );
};

exports.getCoupons = async ( req, res ) => {
    const { searchTerm } = req.query; // Get the search term from the query

    // Build the search query object
    let query = {};

    if ( searchTerm ) {
        // Use a regex to search across multiple fields
        query = {
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } }, // Match title
                { couponCode: { $regex: searchTerm, $options: 'i' } }, // Match coupon code
                { description: { $regex: searchTerm, $options: 'i' } } // Match description
            ]
        };
    }
    // Fetch coupons based on the constructed query
    const coupons = await CouponService.getCoupons( query );

    // Send success response
    sendSuccessResponse( res, {
        message: 'Coupons retrieved successfully',
        data: coupons,
    } );

};

exports.getCoupon = async ( req, res ) => {
    const { id } = req.params;
    if ( !id ) {
        throw new ValidationError( 'Coupon ID is required.' );
    }
    const existingCoupon = await CouponService.findCoupon( { _id: id } );
    if ( !existingCoupon ) {
        throw new NotFoundError( 'Coupon not found.' );
    }
    sendSuccessResponse( res, {
        message: 'Coupon retrieved successfully',
        data: existingCoupon,
    } );
};

exports.updateCoupon = async ( req, res ) => {
    const { id } = req.params;
    const data = req.body;

    if ( !id || Object.keys( data ).length === 0 ) {
        throw new ValidationError( 'Coupon ID and data are required.' );
    }


    const updatedCoupon = await CouponService.updateCouponItem( { couponId: id, data } );
    if ( !updatedCoupon ) {
        throw new NotFoundError( 'Coupon not found.' );
    }

    sendSuccessResponse( res, {
        message: 'Coupon updated successfully',
        data: updatedCoupon,
    } );
};

exports.updateCouponStatus = async ( req, res ) => {
    const { id } = req.params;
    const { status } = req.body;
    if ( !id || !status ) {
        throw new ValidationError( 'Coupon ID and status are required.' );
    }

    if ( !Object.values( COUPON_STATUS ).includes( status ) ) {
        throw new ValidationError( 'Invalid status.' );
    }

    const updatedCoupon = await CouponService.updateCouponItem( { couponId: id, data: { status } } );
    if ( !updatedCoupon ) {
        throw new NotFoundError( 'Coupon not found.' );
    }

    sendSuccessResponse( res, {
        message: 'Coupon status updated successfully',
        data: updatedCoupon,
    } );
};

exports.deleteCoupon = async ( req, res ) => {
    const { id } = req.params;

    if ( !id ) {
        throw new ValidationError( 'Coupon ID is required.' );
    }

    const deletedCoupon = await CouponService.removeCoupon( id );
    if ( !deletedCoupon ) {
        throw new NotFoundError( 'Coupon not found.' );
    }

    sendSuccessResponse( res, {
        message: 'Coupon deleted successfully',
        data: deletedCoupon,
    } );
};

/** 
 * Controller to validate a coupon code.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {ValidationError} when the coupon code is invalid or not applicable.
 * @throws {NotFoundError} when the coupon does not exist. 
 */
exports.checkCouponCode = async (req, res) => {
    const { code } = req.params; // Coupon code from the URL parameter
    const { purchaseAmount } = req.body; // purchaseAmount from the request body to check against minimum purchase amount
    const userId = req.user.id; // Get the user ID from the authenticated user

    // Validate that the coupon code is provided
    if (!code) {
        throw new ValidationError('Coupon code is required.');
    }

    // Retrieve the coupon using the provided coupon code
    const existingCoupon = await CouponService.findCoupon({ couponCode: code });
    // Check if the coupon exists
    if (!existingCoupon) {
        throw new NotFoundError('Coupon not found.');
    }

    const currentDate = new Date(); // Get the current date for validation checks

    // Validate the coupon's active period
    if (existingCoupon.validFrom > currentDate) {
        throw new ValidationError('Coupon is not yet valid.');
    }

    if (existingCoupon.validUntil < currentDate) {
        throw new ValidationError('Coupon has expired.');
    }

    // Validate the minimum purchase amount
    if (existingCoupon.minimumPurchaseAmount > purchaseAmount) {
        throw new ValidationError('The purchase amount does not meet the minimum requirement.');
    }

    // Verify the coupon status
    if (existingCoupon.status !== COUPON_STATUS.ACTIVE) {
        throw new ValidationError('Coupon is not active.');
    }

    // Check if the user has already redeemed the coupon
    if (existingCoupon.redeemedBy.includes(userId)) {
        throw new ValidationError('You have already used this coupon.');
    }

    // Respond with success if all validations pass
    sendSuccessResponse(res, {
        message: 'Coupon code is valid.',
        data: existingCoupon,
    });
};
