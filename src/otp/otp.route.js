const express = require("express");
const router = express.Router();
const otpController = require("./otp.controller");

router
	.route("/:id")
	.get(otpController.Send)
	.put(otpController.Resend)
	.post(otpController.Verify);
    
module.exports = router;
