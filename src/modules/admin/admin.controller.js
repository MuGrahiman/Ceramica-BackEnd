const User = require( "../user/user.model" );
const { generateJWToken, doHashValidation, doHash } = require( "../../utilities/auth" );

exports.Login = async ( req, res ) => {
	try {
		const { email, password } = req.body;
		// Find the admin user by email
		const admin = await User.findOne( { email } ).select( '+password' );
		// Validate the admin user exists
		if ( !admin ) {
			return res.status( 401 ).json( { message: "Invalid Credentials" } );
		}
		if ( admin.roles !== "admin" ) {
			return res.status( 402 ).json( { message: "Invalid Credentials" } );
		}
		// Compare provided password with stored hashed password
		// const isPasswordValid = await admin.isValidPassword( password )
		const isPasswordValid = await doHashValidation( password, admin.password );
		if ( !isPasswordValid ) {
			return res.status( 403 ).json( { message: "Invalid Credentials" } );
		}

		// Generate JWT token with user id and role
		const token = await generateJWToken( {
			id: admin._id
		} );
		return res.status( 200 ).json( {
			message: "Authentication successful",
			user: { token, ...admin.toObject() },
		} );
	} catch ( error ) {
		console.error( "Failed to login as admin", error );
		return res.status( 500 ).json( { message: "Internal Server Error" } );
	}
};


exports.AddAdmin = async ( req, res ) => {
	try {
		const { email, password, firstName, lastName } = req.body;
		// Validate required fields
		if ( !email || !password || !firstName || !lastName ) {
			throw new ValidationError( 'Registration fields are required' );
		}
		// Check if an admin user already exists
		const existingAdmin = await User.findOne( { email } );
		if ( existingAdmin ) {
			return res.status( 400 ).json( { message: "Admin user already exists." } );
		}

		// Create a new admin user
		// const hashedPassword = await doHash( password, 10 ); // Hashing the password
		const newAdmin = new User( {
			firstName,
			lastName,
			email,
			password,
			otpVerified: true,
			status: 'verified',
			roles: "admin"
		} );
		// Save the new admin user to the database
		await newAdmin.save();
		return res.status( 201 ).json( { message: "Admin user created successfully." } );
	} catch ( error ) {
		console.error( "Failed to create admin user", error );
		return res.status( 500 ).json( { message: "Internal Server Error" } );
	}
};
