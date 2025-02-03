// middlewares/errorMiddleware.js
const { UnauthorizedError } = require( "../errors/customErrors" );
const { sendErrorResponse } = require( "../utilities/responses" );

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
	
	sendErrorResponse( res, {
		statusCode,
		message,
		errors: err,
	} );
};