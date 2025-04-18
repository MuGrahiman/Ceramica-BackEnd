// middlewares/verifyAdmin.js
const { UnauthorizedError } = require( "../errors/customErrors" );

const verifyAdmin = ( req, res, next ) => {
    if ( req.user.roles !== "admin" ) {
        throw new UnauthorizedError( "Access Denied. Admin privileges required." );
    }
   return next();
};

module.exports = verifyAdmin;