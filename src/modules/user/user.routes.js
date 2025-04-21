const express = require( 'express' );
const router = express.Router();
const asyncHandler = require( 'express-async-handler' );
const userController = require( './user.controller' );
const verifyToken = require( '../../middlewares/verify.Token.Middleware' );
const verifyAdmin = require( "../../middlewares/verify.Admin.Middleware" );

// Auth routes
router.post( '/sign-up', asyncHandler( userController.register ) );
router.post( '/sign-in', asyncHandler( userController.login ) );
router.post( '/forgot-password', asyncHandler( userController.forgotPassword ) );
router.post( '/reset-password/:token', asyncHandler( userController.resetPassword ) );
// User management routes
router.use( verifyToken )
router.get( '/get', asyncHandler( userController.getAllUsers ) );
router.get( '/get/:id', asyncHandler( userController.getUser ) );
router.patch( '/edit/status/:id', verifyAdmin, asyncHandler( userController.updateUserAccountStatus ) );
router.put( '/edit', asyncHandler( userController.updateUserAccount ) );
router.post( '/change-password', asyncHandler( userController.changePassword ) );

module.exports = router;