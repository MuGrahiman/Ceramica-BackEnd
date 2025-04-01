const otpModel = require( './otp.model' );

class OTPService {

    static async findLatestOTP ( query ) {
        return otpModel
            .find( query )
            .sort( { createdAt: -1 } )
            .limit( 1 )
            .exec();
    }

    static async createOTP ( userId, otp ) {
        return otpModel.create( { userId, otp } );
    }

    static async findOTPById ( otpId ) {
        return otpModel.findById( otpId );
    }

    static async updateOTP ( otpId, newOtp, expireAt ) {
        return otpModel.findByIdAndUpdate(
            otpId,
            { otp: newOtp, expireAt },
            { new: true }
        );
    }

}

module.exports = OTPService;