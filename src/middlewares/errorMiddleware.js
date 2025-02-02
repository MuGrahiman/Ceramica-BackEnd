// module.exports = ( err, req, res, next ) => {
// 	console.error( err );
// 	const statusCode = err.status || 500;
// 	return res.status( statusCode ).json( {
// 		success: false,
// 		message: err.message || "Internal Server Error",
// 	} );
// };

module.exports = (err, req, res, next) => {
	console.error("Error Middleware:", {
	  message: err.message,
	  stack: err.stack,
	  status: err.status,
	});  
  
	const statusCode = err.status || 500;
	const message = err.message || "Internal Server Error";
  
	// Handle specific error types
	if (err.name === "ValidationError") {
	  return res.status(400).json({ success: false, message: "Validation Error", errors: err.errors });
	}
  
	if (err.name === "UnauthorizedError") {
	  return res.status(401).json({ success: false, message: "Unauthorized" });
	}
  
	return res.status(statusCode).json({ success: false, message });
  };