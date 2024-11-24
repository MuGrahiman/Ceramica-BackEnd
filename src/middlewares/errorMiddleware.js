module.exports = (err, req, res, next) => {
	console.error(err);
	const statusCode = err.status || 500;
	res.status(statusCode).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
};
