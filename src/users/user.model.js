const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			default: null,
		},
		guId: {
			type: String,
			default: null,
		},
		fbId: {
			type: String,
			default: null,
		},
		status: {
			type: String,
			enum: ["pending", "registered", "verified", "blocked"],
			default: "pending",
		},
	},
	{ timestamps: true }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
