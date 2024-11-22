const {
	doHashValidation,
	generateJWToken,
	doHash,
} = require("../utilities/auth");
const userModel = require("./user.model");

/**
 * POST /sign-up
 * Register
 */
exports.Register = async (req, res) => {
	const { email, password } = req.body; // Destructure email and password from request body
	try {
		// Check if the user already exists
		const existingUser = await userModel.findOne({ email });
		if (existingUser) {
			// If user exists, return error response
			return res
				.status(401)
				.json({ success: false, message: "User already exists!" });
		}

		// Hash the password before saving
		const hashedPassword = await doHash(password, 12);

		// Create a new user instance
		const newUser = new userModel({
			email,
			password: hashedPassword,
		});
		// Save the new user to the database
		const result = await newUser.save();
		result.password = undefined; // Exclude password from response

		// Return success response
		res.status(201).json({
			success: true,
			message: "Your account has been created successfully",
			result,
		});
	} catch (error) {
		// Log any errors that occur
		console.error(error);
		res.status(401).send({ message: "Failed to register " });
	}
};
/**
 * POST /sign-in
 * Login
 */
exports.Login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const existingUser = await userModel.findOne({ email });
		if (!existingUser) {
			return res.status(404).send({ message: "User not found!" });
		}

		const Password = await doHashValidation(password, existingUser.password);
		if (!Password) {
			return res.status(401).send({ message: "Invalid password!" });
		}

		const token = await generateJWToken({
			id: existingUser._id,
			email: existingUser.email,
			//   role: existingUser.role,
		});

		return res.status(200).json({
			message: "Authentication successful",
			token: token,
			user: {
				username: existingUser.username,
				role: existingUser.role,
			},
		});
		
	} catch (error) {
		console.error("Failed to login as admin", error);
		res.status(401).send({ message: "Failed to login as admin" });
	}
};
