const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true, // Ensure email uniqueness
	},
	password: {
		type: String,
		default: null, // Default to null for social logins
	},
	guId: {
		type: String,
		default: null, // Default to null for users not using Google
	},
	fbId: {
		type: String,
		default: null, // Default to null for users not using Facebook
	},
}, { timestamps: true }); // Optional: Add timestamps for createdAt and updatedAt

const User = mongoose.model("User", userSchema);

module.exports = User;
