const userModel = require("../users/user.model");
const otpModel = require("./otp.model");
const { generateOTP, isOTPExpired } = require("../utilities/auth");
const { sendMail } = require("../utilities/mailer");

/**
 * GET /send/:id
 * Send
 */
exports.Send = async (req, res) => {
	try {
		const { id } = req.params; //params:userId
		console.log("🚀 ~ exports.Send= ~ id:", id)
		const existingUser = await userModel.findById(id);
		console.log("🚀 ~ exports.Send= ~ existingUser:", existingUser)

		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: "User not found!" });
		}


		if (existingUser.status === "blocked") {
			return res.status(401).json({ success: false, message: "Admin Blocked" });
		}

		const existingOTP = await otpModel
			.find({ userId: existingUser._id })
			.sort({ createdAt: -1 }) // Sort by createdAt in descending order
			.limit(1) // Get the latest OTP
			.exec();
		console.log("🚀 ~ exports.Send= ~ existingOTP:", existingOTP);

		if (existingOTP[0]) {
			const isOtpExpired = isOTPExpired(existingOTP[0]?.updatedAt);
			if (!isOtpExpired)
				return res.status(202).json({
					success: true,
					message: "OTP has already been sent.",
					otpId: existingOTP[0]._id,
				});
		}

		const otp = await generateOTP();
		const info = await sendMail(existingUser, otp);
		// Check if the email was successfully sent
		if (info.accepted[0] !== existingUser.email) {
			// If email sending fails, return 400 error
			res.status(400).json({ success: false, message: "Code sending failed!" });
		}

		const newOTP = new otpModel({
			userId: existingUser._id,
			otp: otp,
		});

		await newOTP.save();

		return res.status(201).json({
			success: true,
			message: "OTP is send successfully",
			otpId: newOTP._id,
		});
	} catch (error) {
		// Log any errors that occur
		console.error(error);
		res.status(401).send({ message: "Failed to send otp " });
	}
};

/**
 * PUT
 * Resend
 */
exports.Resend = async (req, res) => {
	const { id } = req.params;
	console.log("🚀 ~ exports.Resend= ~ id:", id);
	try {
		const existingOTP = await otpModel.findById(id);
		if (!existingOTP) {
			return res
				.status(401)
				.json({ success: false, message: "OTP not found!" });
		}

		const existingUser = await userModel.findById(existingOTP.userId);

		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: "User not found!" });
		}

	 

		if (existingUser.status === "blocked") {
			return res.status(401).json({ success: false, message: "Admin Blocked" });
		}

		const newOtp = generateOTP();
		const newData = new Date(Date.now() + 10 * 60 * 1000);
		const isOtpExpired = isOTPExpired(existingOTP.updatedAt);
		let existedOTP;
		if (isOtpExpired) {
			const newOTP = new otpModel({
				userId: existingUser._id,
				otp: newOtp,
			});

			existedOTP = await newOTP.save();
		} else {
			// If OTP is still valid, generate a new one
			existingOTP.otp = newOtp;
			existingOTP.expireAt = newData;

			// Save the updated OTP
			existedOTP = await existingOTP.save();
		}
		// Send the verification code via email
		const info = await sendMail(existingUser, newOtp);

		// Check if the email was successfully sent
		if (info.accepted[0] !== existingUser.email) {
			// If email sending fails, return 400 error
			res.status(400).json({ success: false, message: "Code sending failed!" });
		}

		return res.status(201).json({
			success: true,
			message: "Code send successfully",
			otpId: existedOTP._id,
		});
	} catch (error) {
		// Log any errors that occur
		console.error(error);
		res.status(401).send({ message: "Failed to send code " });
	}
};

/**
 * POST /verify
 * Verify
 */
exports.Verify = async (req, res) => {
	//params:otp_id
	const { id } = req.params;
	const { otp } = req.body;
	console.log("🚀 ~ exports.Verify= ~ req.body:", req.body);

	console.log("🚀 ~ exports.Verify= ~ req.params:", req.params);
	try {
		const existingOTP = await otpModel.findById(id);
		console.log("🚀 ~ exports.Verify= ~ existingOTP:", existingOTP);
		if (!existingOTP) {
			return res
				.status(401)
				.json({ success: false, message: "OTP not exist!" });
		}

		const existingUser = await userModel.findById(existingOTP.userId);
	 

		if (existingUser.status === "blocked") {
			return res.status(401).json({ success: false, message: "Admin Blocked" });
		}

		console.log(
			"🚀 ~ exports.Verify= ~ existingOTP.otp !== otp:",
			existingOTP.otp !== otp
		);
		console.log(
			"🚀 ~ exports.Verify= ~ existingOTP.otp:",
			typeof existingOTP.otp
		);
		console.log("🚀 ~ exports.Verify= ~ otp:", typeof otp);
		if (existingOTP.otp !== otp) {
			return res
				.status(401)
				.json({ success: false, message: "OTP not matched!" });
		}

		(existingUser.status = "verified")
		 await existingUser.save();

		return res.status(200).json({
			success: true,
			message: "Authentication successful",
			// token,
		});
	} catch (error) {
		// Log any errors that occur
		console.error(error);
		res.status(401).send({ message: "Failed to send code " });
	}
};
