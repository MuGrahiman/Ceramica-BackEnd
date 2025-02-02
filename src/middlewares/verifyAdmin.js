


const verifyAdmin = ( req, res, next ) => req.user.role !== "admin" ?
    res.status( 403 ).json( {
        success: false,
        message: "Access Denied. Admin privileges required."
    } ) : next();


module.exports = verifyAdmin;