const {
	doHashValidation,
	generateJWToken,
	doHash,
} = require( "../../utilities/auth" );
const { providerSelector } = require( "../../utilities/providerSelector" );
const UserService = require( "./user.service" );
const { sendSuccessResponse } = require( "../../utilities/responses" );
const { USER_STATUS, SALT_ROUNDS } = require( "../../utilities/constants" );
const {
	ValidationError,
	UnauthorizedError,
	NotFoundError,
	AuthorizationError
} = require( "../../errors/customErrors" );

/**
 * Validates user status
 * @param {Object} user - User object
 * @throws {UnauthorizedError} If user is blocked or not verified
 */
const validateUserStatus = ( user ) => {
	if ( user.isBlocked() ) {
		throw new UnauthorizedError( 'Account is blocked by admin' );
	}
	if ( !user.isVerified() ) {
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
		if ( existingUser.isBlocked() ) {
			throw new UnauthorizedError( 'Account is blocked by admin' );
		}
		if ( existingUser.isVerified() ) {
			throw new ValidationError( 'User already exists' );
		}

		// Return existing unverified user
		// existingUser.password = undefined;
		return sendSuccessResponse( res, {
			message: 'Registration in progress',
			data: existingUser
		} );
	}

	// Register new user

	const user = await UserService.registerUser( {
		email,
		password,
		firstName,
		lastName,
	} );

	// user = await UserService.registerUser( email, hashedPassword )

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
	const providerValues = {
		local: password,
		google: uid,
		facebook: uid,
	};
	const currentAuthValue = providerValues[ provider ]

	// providerSelector( provider, {
	// 	local: password,
	// 	google: uid,
	// 	facebook: uid,
	// } );

	if ( !currentAuthValue )
		throw new ValidationError( 'Auth provider is not valid' );

	// const existingAuthValue = providerSelector( provider, {
	// 	password: user.password,
	// 	guId: user.googleId,
	// 	fbId: user.facebookId
	// } );
	const userAuthValue = await user.getAuthProvider( provider );
	if ( !userAuthValue )
		throw new ValidationError( 'Auth provider is not valid' );

	const { email: existMail, ...existingValue } = userAuthValue
	const [ existingAuthValue ] = Object.values( existingValue );
	// Handle authentication
	if ( typeof existingAuthValue === "string" && existingAuthValue.trim() !== "" ) {
		const isValid = await doHashValidation( currentAuthValue, existingAuthValue );
		if ( !isValid ) {
			throw new AuthorizationError( 'Invalid credentials' );
		}
		await user.addActivityLog( 'Logged in',
			'User logged in successfully using ' + provider + ' platform' );
	} else {
		// First time social Logged in - save provider ID
		// const providerField = providerSelector( provider, PROVIDER_FIELDS );
		user.authProviders[ provider ].id = await doHash( uid, SALT_ROUNDS );
		await user.save();
		await user.addActivityLog( 'Logged in',
			'User newly logged in successfully using ' + provider + ' platform' );

	}

	// Generate JWT token
	const token = await generateJWToken( { id: user._id } );
	await user.updateLastLogin();
	const userData = user.toObject();
	// delete userData.password;

	sendSuccessResponse( res, {
		message: "Logged in successfully",
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

exports.getAllUsers = async ( req, res ) => {
	const { status, searchTerm, sort } = req.query;
	// Construct search query
	const searchQuery = searchTerm ? {
		$or: [
			{ firstName: { $regex: searchTerm, $options: 'i' } },
			{ lastName: { $regex: searchTerm, $options: 'i' } },
			{ email: { $regex: searchTerm, $options: 'i' } },
			{ status: { $regex: searchTerm, $options: 'i' } }
		]
	} : {};

	// Construct filter for status
	const statusFilter = status && status.length
		? Array.isArray( status ) ? { $in: status } : { status }
		: {};

	// Fetch users from service
	const users = await UserService.fetchUsers(
		{ ...searchQuery, ...statusFilter },
		sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }
	);
	sendSuccessResponse( res, {
		message: "Users retrieved successfully",
		data: users,
	} );
	// res.status(200).json({
	//     success: true,
	//     message: "Users retrieved successfully",
	//     data: users,
	//     count: users.length
	// });

};

exports.getUser = async ( req, res ) => {
	const { id } = req.params;
	if ( !id ) {
		throw new ValidationError( 'Inquiry ID is required' );
	}

	const user = await UserService.findUser( { _id: id } );
	if ( !user ) {
		throw new NotFoundError( 'User not found' );
	}

	sendSuccessResponse( res, {
		message: "Users retrieved successfully",
		data: user,
	} );

};

// controller
exports.updateUserAccountStatus = async ( req, res ) => {
	const { id } = req.params;
	const { status } = req.body; // Destructure status directly from req.body
	const validStatuses = [ 'block', 'unblock' ]; // Use consistent casing

	// Validate input
	if ( !id ) {
		throw new ValidationError( 'User ID is required' );
	}
	if ( !status || !validStatuses.includes( status.toLowerCase() ) ) {
		throw new ValidationError( 'Status is not valid' );
	}

	const user = await UserService.findUser( { _id: id } );
	if ( !user ) {
		throw new NotFoundError( 'User not found' );
	}

	const updatedUser = await updateUserStatus( user, status );
	if ( !updatedUser ) {
		throw new NotFoundError( 'Status not updated' );
	}
	await updatedUser.addActivityLog( 'updated status', status + ' User status successfully' );

	sendSuccessResponse( res, {
		message: "User status updated successfully",
		data: updatedUser,
	} );
};

async function updateUserStatus ( user, status ) {
	if ( status.toLowerCase() === 'block' ) {
		return await UserService.updateUser( user._id, { status: USER_STATUS.BLOCKED } );
	} else if ( status.toLowerCase() === 'unblock' ) {
		const newStatus = user.otpVerified ? USER_STATUS.VERIFIED : USER_STATUS.REGISTERED;
		return await UserService.updateUser( user._id, { status: newStatus } );
	}
	return null;
}
