const { NotFoundError } = require( "../errors/customErrors" );

// Using `notFoundMiddleware` as an example
module.exports = ( req, res, next ) => {
    const error = new NotFoundError( "Not found the url" );
    next( error );
};
