const UserService = require( './user.service' );
const UserRepository = require( "./user.repository" );
const { sendSuccessResponse } = require( '../../utilities/responses' );

exports.register = async ( req, res ) => {
	const user = await UserService.registerUser( req.body );
	sendSuccessResponse( res, {
		message: user.isVerified() ? 'User already exists' : 'Registration successful',
		data: user
	} );
};

exports.login = async ( req, res ) => {
	const { user, token } = await UserService.loginUser( req.body );
	sendSuccessResponse( res, {
		message: 'Logged in successfully',
		data: { token, ...user }
	} );
};

exports.forgotPassword = async ( req, res ) => {
	const { userId } = await UserService.initiateResetPassword( req.body.email );
	sendSuccessResponse( res, {
		message: 'Password reset initiated',
		data: { userId }
	} );
};

exports.resetPassword = async ( req, res ) => {
	const { userId } = await UserService.applyResetPassword( req.params.token, req.body);
	sendSuccessResponse( res, {
		message: 'Password reset initiated',
		data: { userId }
	} );
};

exports.getAllUsers = async ( req, res ) => {
	const users = await UserService.fetchUsers( req.query );
	sendSuccessResponse( res, {
		message: 'Users retrieved successfully',
		data: users
	} );
};

exports.getUser = async ( req, res ) => {
	const user = await UserRepository.findUser( { _id: req.params.id } );
	sendSuccessResponse( res, {
		message: 'User retrieved successfully',
		data: user
	} );
};

exports.updateUserAccountStatus = async ( req, res ) => {
	const updatedUser = await UserService.updateUserStatus(
		req.params.id,
		req.body.status
	);
	sendSuccessResponse( res, {
		message: 'Status updated successfully',
		data: updatedUser
	} );
};

exports.updateUserAccount = async ( req, res ) => {
	const updatedUser = await UserService.updateUser(
		req.user._id,
		req.body
	);
	sendSuccessResponse( res, {
		message: 'Status updated successfully',
		data: updatedUser
	} );
};

exports.changePassword = async ( req, res ) => {
	const updatedUser = await UserService.VerifyPassword(
		req.user._id,
		req.body
	);
	sendSuccessResponse( res, {
		message: 'Password changed successfully',
		data: updatedUser
	} );
};