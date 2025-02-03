
// Standardized utility response format
exports.sendSuccessResponse =
    ( res, { statusCode = 200, message = "Successful", data = null } ) => {
        return res.status( statusCode ).json( {
            success: true,
            message,
            data,
        } );
    };

exports.sendErrorResponse =
    ( res, { statusCode = 400, message = "An error occurred", errors = null } ) => {
        const errorDetails = {
            name: errors?.name || "Error",
            status: statusCode,
            stack: process.env.NODE_ENV === "development" ? errors?.stack : undefined,
        };

        return res.status( statusCode ).json( {
            success: false,
            message,
            error: errorDetails,
        } );
    };