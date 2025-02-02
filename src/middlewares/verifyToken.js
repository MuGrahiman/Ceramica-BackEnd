const { verifyJWToken } = require( "../utilities/auth" );
const userModel = require( "../users/user.model" );

const verifyToken = async ( req, res, next ) => {
    const authorizationHeader = req.headers[ 'authorization' ];
    const token = authorizationHeader && authorizationHeader.split( ' ' )[ 1 ];

    if ( !token ) {
        return res.status( 401 ).json( { success: false, message: 'Access Denied. No token provided.' } );
    }

    try {
        const data = await verifyJWToken( token );
        const user = await userModel.findById( data.id );

        if ( !user ) {
            return res.status( 404 ).json( { success: false, message: "User not found." } );
        }

        req.user = user;
        return next();
    } catch ( err ) {
        console.error( "Token verification error:", err );

        if ( err.name === "TokenExpiredError" ) {
            return res.status( 401 ).json( { success: false, message: "Token expired. Please log in again." } );
        }

        return res.status( 403 ).json( { success: false, message: 'Invalid credentials.' } );
    }
}; 

module.exports = verifyToken;      