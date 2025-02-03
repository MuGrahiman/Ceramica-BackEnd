const User = require( "../users/user.model" );
const { generateJWToken, doHashValidation } = require( "../../utilities/auth" );

exports.Login = async ( req, res ) => {
	try {
		const { email, password } = req.body;

		// Find the admin user by email
		const admin = await User.findOne( { email: email } );

		// Validate the admin user exists
		if ( !admin || admin.role !== "admin" ) {
			return res.status( 401 ).json( { message: "Invalid Credentials" } );
		}

		// Compare provided password with stored hashed password
		const isPasswordValid = await doHashValidation( password, admin.password );
		if ( !isPasswordValid ) {
			return res.status( 401 ).json( { message: "Invalid Credentials" } );
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
		const { email, password } = req.body;

		// Check if an admin user already exists
		const existingAdmin = await User.findOne( { email: email } );
		if ( existingAdmin ) {
			return res.status( 400 ).json( { message: "Admin user already exists." } );
		}

		// Create a new admin user
		const hashedPassword = await bcrypt.hash( password, 10 ); // Hashing the password
		const newAdmin = new User( {
			email: email,
			password: hashedPassword,
			role: "admin"
		} );

		// Save the new admin user to the database
		await newAdmin.save();

		return res.status( 201 ).json( { message: "Admin user created successfully." } );
	} catch ( error ) {
		console.error( "Failed to create admin user", error );
		return res.status( 500 ).json( { message: "Internal Server Error" } );
	}
};
