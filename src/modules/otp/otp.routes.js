const express = require( "express" );
const router = express.Router();
const otpController = require( "./otp.controller" );
const asyncHandler = require( "express-async-handler" );

router
	.route( "/:id" )
	.get( asyncHandler( otpController.send ) )
	.put( asyncHandler( otpController.resend ) )
	.post( asyncHandler( otpController.verify ) );

module.exports = router;
