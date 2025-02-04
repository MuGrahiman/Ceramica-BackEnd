// errors/customErrors.js

// Base class for custom errors
class CustomError extends Error {
    constructor ( message, statusCode, name ) {
        super( message );
        this.statusCode = statusCode; // HTTP status code associated with the error
        this.name = name; // Name of the error for identification
        this.success = false; // Indicates that an error occurred
    }
}

// ValidationError: The provided data fails validation rules
class ValidationError extends CustomError {
    constructor ( message = "Validation Error" ) {
        super( message, 400, "ValidationError" );
    }
}

// UnauthorizedError: The request requires user authentication
class UnauthorizedError extends CustomError {
    constructor ( message = "Unauthorized" ) {
        super( message, 401, "UnauthorizedError" );
    }
}

// NotFoundError: The requested resource could not be found
class NotFoundError extends CustomError {
    constructor ( message = "Not Found" ) {
        super( message, 404, "NotFoundError" );
    }
}

// InternalServerError: The server encountered an unexpected condition
class InternalServerError extends CustomError {
    constructor ( message = "Internal Server Error" ) {
        super( message, 500, "InternalServerError" );
    }
}

//ForbiddenError:The user is authenticated but doesn’t have the required permissions 
class ForbiddenError extends CustomError {
    constructor ( message = "Forbidden" ) {
        super( message, 403, "ForbiddenError" );
    }
}

// ConflictError: The current state of the resource have conflict with the requested data
class ConflictError extends CustomError {
    constructor ( message = "Conflict Error" ) {
        super( message, 409, "ConflictError" );
    }
}

// BadRequestError: The request was invalid or cannot be processed
class BadRequestError extends CustomError {
    constructor(message = "Bad Request") {
        super(message, 422, "BadRequestError");
    }
}

// TimeoutError: The request has timed out
class TimeoutError extends CustomError {
    constructor(message = "Request Timeout") {
        super(message, 408, "TimeoutError");
    }
}

module.exports = {
    CustomError,
    ValidationError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError,
    ForbiddenError,
    ConflictError,
    BadRequestError, 
    TimeoutError, 
};

