const { hash, compare, genSalt } = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );
const env = require( "../configs/env.config" );

// Function to generate token
exports.generateJWToken = ( value, expiresIn = "1h" ) =>
	jwt.sign( value, env.JWT_SECRET, { expiresIn } );

// Function to verify token
exports.verifyJWToken = ( token ,message) => {
	return new Promise( ( resolve, reject ) => {
		jwt.verify( token, env.JWT_SECRET, ( err, user ) => {
			if ( err ) {
				err.action = message; 
				return reject( err );
			}
			resolve( user );
		} );
	} );
};


/**
 * Function to hash a value with bcryptjs.
 * 
 * @param {string} value - The input string to hash.
 * @param {number} [saltValue=10] - Optional: The number of salt rounds (default is 10).
 * @returns {Promise<string>} - The hashed value.
 */
exports.doHash = async ( value, saltValue = 10 ) => {
	const salt = await genSalt( saltValue );
	return hash( value, salt );
}

// Function to validate a value against a hashed value
exports.doHashValidation = ( value, hashedValue ) => {
	return compare( value, hashedValue );
}


// Function to validate OTP Expiry Date
exports.isOTPExpired = ( otp ) => new Date() - new Date( otp ) > 5 * 60 * 1000;

//TODO: Combine both code as one

// Generate a random 4-digit verification code
exports.generateOTP = () => {
	let otp = Math.floor( 1000 + Math.random() * 9000 ).toString();
	console.info( "otp:", otp )
	return otp;
};

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

