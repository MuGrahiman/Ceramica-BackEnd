const { hash, compare } = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );
const env = require( "../configs/env.config" );

// Function to generate token
exports.generateJWToken = ( value ) =>
	jwt.sign( value, env.JWT_SECRET, { expiresIn: "1h" } );

// Function to verify token
exports.verifyJWToken = ( token ) => {
	return new Promise( ( resolve, reject ) => {
		jwt.verify( token, env.JWT_SECRET, ( err, user ) => {
			if ( err ) {
				return reject( err );
			}
			resolve( user );
		} );
	} );
};

// Function to hash a value
exports.doHash = ( value, saltValue ) => hash( value, saltValue );

// Function to validate a value against a hashed value
exports.doHashValidation = ( value, hashedValue ) => compare( value, hashedValue );

// Generate a random 4-digit verification code
exports.generateOTP = () => {
	let otp = Math.floor( 1000 + Math.random() * 9000 ).toString();
	console.info( "otp:", otp )
	return otp;
};

// Function to validate OTP Expiry Date
exports.isOTPExpired = ( otp ) => new Date() - new Date( otp ) > 5 * 60 * 1000;



/**
 * Generate a unique coupon code.
 * @param {number} length - The length of the coupon code.
 * @returns {Promise<string>} The generated coupon code.
 */
exports.generateCouponCode = async ( length = 10 ) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	let couponCode = '';

	for ( let i = 0; i < length; i++ ) {
		couponCode += characters.charAt( Math.floor( Math.random() * characters.length ) );
	}

	return couponCode;
};

