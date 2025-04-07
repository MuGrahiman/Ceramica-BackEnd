const express = require( "express" );
const router = express.Router();
const asyncHandler = require( 'express-async-handler' );
const userController = require( "./user.controller" );

//TODO : manage forgot password, create route for update user status
router.post( "/sign-up", asyncHandler( userController.register ) );
router.post( "/sign-in", asyncHandler( userController.login ) );
router.post( "/forgot", asyncHandler( userController.forgotPassword ) );
router.get( "/get", asyncHandler( userController.getAllUsers ) );
router.get( "/get/:id", asyncHandler( userController.getUser ) );
router.put( "/edit/:id", asyncHandler( userController.updateUserAccountStatus ) );

module.exports = router;