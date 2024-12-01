const express = require("express");
const router = express.Router();
const otpController = require("./otp.controller");

// router.get("/send/:id", otpController.Send);
// router.put("/resend", otpController.Resend);
// router.post("/sign-in", otpController.Verify);

router
	.route("/:id")
	.get(otpController.Send)
	.put(otpController.Resend)
	.post(otpController.Verify);
    
module.exports = router;
