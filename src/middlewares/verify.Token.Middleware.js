// middlewares/verifyToken.js
const { verifyJWToken } = require( "../utilities/auth" );
const userModel = require( "../modules/user/user.model" );
const { UnauthorizedError, NotFoundError } = require( "../errors/customErrors" );

const verifyToken = async ( req, res, next ) => {
    const authorizationHeader = req.headers[ "authorization" ];
    const token = authorizationHeader && authorizationHeader.split( " " )[ 1 ];
    if ( !token ) {
        return next( new UnauthorizedError( "Access Denied. No token provided." ) );
    }

    try {
        const data = await verifyJWToken( token );
        const user = await userModel.findById( data.id );

        if ( !user ) {
            return next( new UnauthorizedError( "User not found." ) );
        }

        req.user = user;
        return next();
    } catch ( err ) {
        console.error( "Token verification error:", err );

        return next( err );
    }
};

module.exports = verifyToken;