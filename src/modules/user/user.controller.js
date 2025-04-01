const {
	doHashValidation,
	generateJWToken,
	doHash,
} = require( "../../utilities/auth" );
const { providerSelector } = require( "../../utilities/providerSelector" );
const UserService = require( "./user.service" );
const { sendSuccessResponse } = require( "../../utilities/responses" );
const { USER_STATUS } = require( "../../utilities/constants" );
const {
	ValidationError,
	UnauthorizedError,
	NotFoundError,
	AuthorizationError
} = require( "../../errors/customErrors" );

// Constants
const SALT_ROUNDS = 12;
const PROVIDER_FIELDS = {
	password: 'password',
	guId: 'guId',
	fbId: 'fbId'
}

/**
 * Validates user status
 * @param {Object} user - User object
 * @throws {UnauthorizedError} If user is blocked or not verified
 */
const validateUserStatus = ( user ) => {
	if ( user.status === USER_STATUS.BLOCKED ) {
		throw new UnauthorizedError( 'Account is blocked by admin' );
	}
	if ( user.status !== USER_STATUS.VERIFIED ) {
		throw new UnauthorizedError( 'Account not verified' );
	}
};

/**
 * @desc Register a new user
 * @route POST /auth/sign-up
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} firstName - User first name
 * @param {string} lastName - User last name
 * @param {string} confirmPassword - Password confirmation
 * @returns {Object} Registered user data
 */
exports.register = async ( req, res ) => {
	const { email, password, firstName, lastName, confirmPassword } = req.body;

	// Validate required fields
	if ( !email || !password || !firstName || !lastName || !confirmPassword ) {
		throw new ValidationError( 'Registration fields are required' );
	}

	if ( password !== confirmPassword ) {
		throw new ValidationError( 'Passwords do not match' );
	}

	// Check existing user
	const existingUser = await UserService.findUser( { email } );

	if ( existingUser ) {
		if ( existingUser.status === USER_STATUS.BLOCKED ) {
			throw new UnauthorizedError( 'Account is blocked by admin' );
		}
		if ( existingUser.status === USER_STATUS.VERIFIED ) {
			throw new ValidationError( 'User already exists' );
		}
		// Return existing unverified user
		existingUser.password = undefined;
		return sendSuccessResponse( res, {
			message: 'Registration in progress',
			data: existingUser
		} );
	}

	// Register new user
	const hashedPassword = await doHash( password, SALT_ROUNDS );
	// const user = await UserService.registerUser( {
	// 	email,
	// 	password: hashedPassword,
	// 	firstName,
	// 	lastName,
	// 	status: USER_STATUS.REGISTERED
	// } );
	user = await UserService.registerUser( email, hashedPassword )

	sendSuccessResponse( res, {
		message: 'User registered successfully',
		data: user
	} );
};

/**
 * @desc Authenticate user
 * @route POST /auth/sign-in
 * @param {string} email - User email
 * @param {string} [password] - User password (for email/password auth)
 * @param {string} [uid] - Provider user ID (for social auth)
 * @param {string} provider - Auth provider (password/google/facebook)
 * @returns {Object} Contains JWT token and user data
 */
exports.login = async ( req, res ) => {
	const { email, password, uid, provider } = req.body;

	if ( !provider ) {
		throw new ValidationError( 'Auth provider is required' );
	}

	const user = await UserService.findUser( { email } );
	if ( !user ) {
		throw new NotFoundError( 'User not found' );
	}

	validateUserStatus( user );

	// Get provider-specific values
	const currentAuthValue = providerSelector( provider, {
		password,
		guId: uid,
		fbId: uid
	} );

	const existingAuthValue = providerSelector( provider, {
		password: user.password,
		guId: user.googleId,
		fbId: user.facebookId
	} );

	// Handle authentication
	if ( existingAuthValue ) {
		const isValid = await doHashValidation( currentAuthValue, existingAuthValue );
		if ( !isValid ) {
			throw new AuthorizationError( 'Invalid credentials' );
		}
	} else {
		// First time social login - save provider ID
		const providerField = providerSelector( provider, PROVIDER_FIELDS );
		user[ providerField ] = await doHash( uid, SALT_ROUNDS );
		await user.save();
	}

	// Generate JWT token
	const token = await generateJWToken( { id: user._id } );
	const userData = user.toObject();
	delete userData.password;

	sendSuccessResponse( res, {
		message: "Login successful",
		data: { token, ...userData }
	} );
};

/**
 * @desc Initiate password reset
 * @route POST /auth/forgot-password
 * @param {string} email - User email
 * @returns {Object} Contains user ID for reference
 */
exports.forgotPassword = async ( req, res ) => {
	const { email } = req.body;
	const user = await UserService.findUser( { email } );

	if ( !user ) {
		throw new NotFoundError( 'User not found' );
	}

	validateUserStatus( user );

	sendSuccessResponse( res, {
		message: "Password reset initiated",
		data: { userId: user._id }
	} );
};