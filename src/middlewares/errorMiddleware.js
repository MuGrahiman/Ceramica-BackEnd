// middlewares/errorMiddleware.js

const { ApiError } = require( "@paypal/paypal-server-sdk" );
const { UnauthorizedError } = require( "../errors/customErrors" );
const { sendErrorResponse } = require( "../utilities/responses" );
const { MongooseError } = require( "mongoose" );

module.exports = ( err, req, res, next ) => {
	console.error( "Error Middleware:", {
		message: err.message,
		stack: err.stack,
		status: err.statusCode,
	} );

	let statusCode = err.statusCode || 500;
	let message = err.message || "Internal Server Error";

	if ( err.name === "TokenExpiredError" ) {
		const newError = new UnauthorizedError( "Token expired. Please log in again." );
		statusCode = newError.statusCode;
		message = newError.message
	}

	if ( err.name === "TimeoutError" ) {
		const newError = new TimeoutError( "The request has timed out. Please try again." );
		statusCode = newError.statusCode;
		message = newError.message;
	}

	if ( err instanceof ApiError ) {
		const newError = err.result;
		statusCode = newError.statusCode;
		message = newError.message;
	}

	if ( err instanceof MongooseError ) {
		statusCode = err.statusCode;
		message = err.message;
	}

	sendErrorResponse( res, {
		statusCode,
		message, 
		errors: err, 
	} );
};