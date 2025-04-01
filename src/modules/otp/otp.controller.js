const { generateOTP, isOTPExpired } = require( "../../utilities/auth" );
const { sendMail } = require( "../../utilities/mailer" );
const OTPService = require( './otp.service' );
const UserService = require( "../user/user.service" );
const { USER_STATUS, OTP_EXPIRATION_MS } = require( "../../utilities/constants" );
const {
	UnauthorizedError,
	ValidationError,
	NotFoundError
} = require( "../../errors/customErrors" );
const { sendSuccessResponse } = require( "../../utilities/responses" );


/**
 * Validates user status
 * @param {Object} user - User object
 * @throws {UnauthorizedError} If user is blocked
 */
const validateUserStatus = ( user ) => {
	if ( user.status === USER_STATUS.BLOCKED ) {
		throw new UnauthorizedError( 'Account is blocked by admin' );
	}
};

/**
 * Sends OTP email to user
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @throws {ValidationError} If email fails to send
 */
const sendOtpEmail = async ( email, otp ) => {
	const info = await sendMail(
		email,
		'OTP Verification Code',
		`<h1>${ otp }</h1>`
	);

	if ( info.accepted[ 0 ] !== email ) {
		throw new ValidationError( 'Failed to send OTP email' );
	}
};

/**
 * @desc Send OTP to user
 * @route GET /otp/send/:id
 * @param {string} id - User ID
 * @returns {Object} Contains OTP ID
 */
exports.send = async ( req, res ) => {
	const { id } = req.params;
	if ( !id ) throw new ValidationError( 'User ID is required' );

	const user = await UserService.findUser( { _id: id } );
	if ( !user ) throw new NotFoundError( 'User not found' );
	validateUserStatus( user );

	const [ latestOTP ] = await OTPService.findLatestOTP( { userId: user._id } );

	if ( latestOTP && !isOTPExpired( latestOTP.updatedAt ) ) {
		return sendSuccessResponse( res, {
			statusCode: 202,
			message: 'OTP already sent',
			data: { otpId: latestOTP._id }
		} );
	}

	const otp = await generateOTP();
	await sendOtpEmail( user.email, otp );

	const newOTP = await OTPService.createOTP( user._id, otp );
	sendSuccessResponse( res, {
		statusCode: 201,
		message: 'OTP sent successfully',
		data: { otpId: newOTP._id }
	} );
};

/**
 * @desc Resend OTP to user
 * @route PUT /otp/resend/:id
 * @param {string} id - OTP ID
 * @returns {Object} Contains new OTP ID
 */
exports.resend = async ( req, res ) => {
	const { id } = req.params;
	if ( !id ) throw new ValidationError( 'OTP ID is required' );

	const existingOTP = await OTPService.findOTPById( id );
	if ( !existingOTP ) throw new NotFoundError( 'OTP not found' );

	const user = await UserService.findUser( { _id: existingOTP.userId } );
	if ( !user ) throw new NotFoundError( 'User not found' );
	validateUserStatus( user );

	const newOtp = generateOTP();
	const expirationDate = new Date( Date.now() + OTP_EXPIRATION_MS );

	const updatedOTP = isOTPExpired( existingOTP.updatedAt )
		? await OTPService.createOTP( user._id, newOtp )
		: await OTPService.updateOTP( id, newOtp, expirationDate );

	await sendOtpEmail( user.email, newOtp );

	sendSuccessResponse( res, {
		statusCode: 201,
		message: 'OTP resent successfully',
		data: { otpId: updatedOTP._id }
	} );
};

/**
 * @desc Verify OTP
 * @route POST /otp/verify/:id
 * @param {string} id - OTP ID
 * @param {string} otp - OTP code to verify
 * @returns {Object} Success message
 */
exports.verify = async ( req, res ) => {
	const { id } = req.params;
	const { otp } = req.body;

	if ( !id ) throw new ValidationError( 'OTP ID is required' );
	if ( !otp ) throw new ValidationError( 'OTP code is required' );

	const existingOTP = await OTPService.findOTPById( id );
	if ( !existingOTP ) throw new NotFoundError( 'OTP not found' );

	const user = await UserService.findUser( { _id: existingOTP.userId } );
	validateUserStatus( user );

	if ( existingOTP.otp !== otp ) {
		throw new ValidationError( 'Invalid OTP code' );
	}

	await UserService.updateUser( user._id, { status: USER_STATUS.VERIFIED } );
	sendSuccessResponse( res, { message: 'OTP verified successfully' } );
};