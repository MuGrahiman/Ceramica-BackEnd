const { hash, compare } = require("bcryptjs"); // Import bcryptjs functions
const jwt = require("jsonwebtoken"); // Import jsonwebtoken functions
const env = require("../configs/env.config");

// Function to generate token
exports.generateJWToken = (value) =>
	jwt.sign(value, env.JWT_SECRET, { expiresIn: "1h" });

// Function to verify token
exports.verifyJWToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, env.JWT_SECRET, (err, user) => {
			if (err) {
				return reject(err);
			}
			resolve(user);
		});
	});
};

// Function to hash a value
exports.doHash = (value, saltValue) => hash(value, saltValue); // Hash the value with the specified salt

// Function to validate a value against a hashed value
exports.doHashValidation = (value, hashedValue) => compare(value, hashedValue); // Compare the plain value with the hashed value
