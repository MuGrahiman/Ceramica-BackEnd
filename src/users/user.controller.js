const {
	doHashValidation,
	generateJWToken,
	doHash,
	generateOTP,
} = require("../utilities/auth");
const { sendMail } = require("../utilities/mailer");
const { providerSelector } = require("../utilities/providerSelector");
const userModel = require("./user.model");
const otpModel = require("../otp/otp.model");

/**
 * POST /sign-up
 * Register
 */
exports.Register = async (req, res) => {
	const { email, password } = req.body;
	try {
		const existingUser = await userModel.findOne({ email });
		console.log("🚀 ~ exports.Register= ~ existingUser:", existingUser);

		if (existingUser && existingUser.status === "verified") {
			return res
				.status(401)
				.json({ success: false, message: "User already exists!" });
		}

		if (existingUser && existingUser.status === "blocked") {
			return res.status(401).json({ success: false, message: "Admin Blocked" });
		}

		if (existingUser && existingUser.status === "registered") {
			return res.status(201).json({
				success: true,
				message: "User registered successfully",
				userId: existingUser._id,
			});
		}

		const hashedPassword = await doHash(password, 12);

		const newUser = new userModel({
			email,
			password: hashedPassword,
			status: "registered",
		});

		const result = await newUser.save();
		result.password = undefined;

		return res.status(201).json({
			success: true,
			message: "User registered successfully",
			userId: result._id,
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
	try {
		const { email, password, uid, provider } = req.body;
		console.log("🚀 ~ exports.Login= ~ req.body:", req.body);

		// Check if the user exists
		const existingUser = await userModel.findOne({ email });
		if (!existingUser) {
			return res.status(404).json({ message: "User not found!" });
		}

		if (existingUser.status !== "verified") {
			return res
				.status(401)
				.json({ success: false, message: "User not verified" });
		}

		if (existingUser.status === "blocked") {
			return res.status(401).json({ success: false, message: "Admin Blocked" });
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
			role:'client'
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

/**
 * POST /forgotten
 * Forgotten
 */
exports.Forgotten = async (req, res) => {
	const { email } = req.body;
	console.log("🚀 ~ exports.Forgotten= ~ email:", email)
	try {
		const existingUser = await userModel.findOne({ email });
		console.log("🚀 ~ exports.Forgotten= ~ existingUser:", existingUser)

		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: "User is not found!" });
		}

		if (existingUser.status !== "verified") {
			return res
				.status(401)
				.json({ success: false, message: "User is not verified!" });
		}

		if (existingUser.status === "blocked") {
			return res.status(401).json({ success: false, message: "Admin Blocked" });
		}

		return res.status(201).json({
			success: true,
			message: "User confirmed successfully",
			userId: existingUser._id,
		});

		
	} catch (error) {
		// Log any errors that occur
		console.error(error);
		res.status(401).send({ message: "Failed to send code " });
	}
};
