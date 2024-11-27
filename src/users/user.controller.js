const {
	doHashValidation,
	generateJWToken,
	doHash,
} = require("../utilities/auth");
const { providerSelector } = require("../utilities/providerSelector");
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

// exports.Login = async (req, res) => {
// 	try {
// 		const { email, password } = req.body;

// 		const existingUser = await userModel.findOne({ email });
// 		if (!existingUser) {
// 			return res.status(404).send({ message: "User not found!" });
// 		}

// 		const Password = await doHashValidation(password, existingUser.password);
// 		if (!Password) {
// 			return res.status(401).send({ message: "Invalid password!" });
// 		}

// 		const token = await generateJWToken({
// 			id: existingUser._id,
// 			email: existingUser.email,
// 			//   role: existingUser.role,
// 		});

// 		return res.status(200).json({
// 			message: "Authentication successful",
// 			token: token,
// 		});
// 	} catch (error) {
// 		console.error("Failed to login as admin", error);
// 		res.status(401).send({ message: "Failed to login as admin" });
// 	}
// };

// exports.Register = async (req, res) => {
// 	const { email, password, guId, fbId, provider } = req.body;
// 	try {
// 		// Check if the user already exists
// 		const existingUser = await userModel.findOne({ email });
// 		if (existingUser) {
// 			// If user exists, return error response
// 			return res
// 				.status(401)
// 				.json({ success: false, message: "User already exists!" });
// 		}

// 		const uid = providerSelector(provider, { password, guId, fbId });
// 		// Hash the password before saving
// 		const hashedId = await doHash(uid, 12);

// 		// Create a new user instance
// 		const newUser = new userModel({
// 			email,
// 			password: password ? hashedId : null,
// 			guId: guId ? hashedId : null,
// 			fbId: fbId ? hashedId : null,
// 		});
// 		// Save the new user to the database
// 		const result = await newUser.save();

// 		// Return success response
// 		res.status(201).json({
// 			success: true,
// 			message: "Your account has been created successfully",
// 			result,
// 		});
// 	} catch (error) {
// 		// Log any errors that occur
// 		console.error(error);
// 		res.status(401).send({ message: "Failed to register " });
// 	}
// };

/**
 * POST /sign-in 
 * Login
 */
exports.Login = async (req, res) => {
	try {
		const { email, password, uid, provider } = req.body;
		console.log("🚀 ~ exports.Login= ~ req.body:", req.body);

		// Check if the user exists
		const existingUser = await userModel.findOne({ email });
		if (!existingUser) {
			return res.status(404).json({ message: "User not found!" });
		}

		// Get current and existing provider data
		const currentValue = providerSelector(provider, {
			password,
			guId: uid,
			fbId: uid,
		});
		console.log("🚀 ~ exports.Login= ~ currentValue:", currentValue);
		const existingProviderValue = providerSelector(provider, {
			password: existingUser.password,
			guId: existingUser.guId,
			fbId: existingUser.fbId,
		});

		// Handle validation or adding new provider data
		if (existingProviderValue) {
			// Validate the provider credentials
			const isValid = await doHashValidation(
				currentValue,
				existingProviderValue
			);
			if (!isValid) {
				return res.status(401).json({ message: "Invalid credentials!" });
			}
		} else {
			// Update the user with new provider credentials
			const property = providerSelector(provider, {
				password: "password",
				guId: "guId",
				fbId: "fbId",
			});
			console.log(
				"🚀 ~ exports.Login= ~ existingUser[property]:",
				existingUser[property]
			);
			existingUser[property] = await doHash(currentValue, 12); // Hash the new value
			await existingUser.save();
		}

		// Generate JWT token
		const token = await generateJWToken({
			id: existingUser._id,
			email: existingUser.email,
		});

		return res.status(200).json({
			success: true,
			message: "Authentication successful",
			token,
		});
	} catch (error) {
		console.error("Error during login:", error);
		return res
			.status(500)
			.json({ success: false, message: "Failed to login." });
	}
};
