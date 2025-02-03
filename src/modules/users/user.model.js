const mongoose = require( "mongoose" );
const bcrypt = require( "bcryptjs" );

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			default: null,
		},
		lastName: {
			type: String,
			default: null,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			default: null,
		},
		guId: {//google unique id 
			type: String,
			default: null,
		},
		fbId: {//face book unique id 
			type: String,
			default: null,
		},
		status: {
			type: String,
			enum: [ "pending", "registered", "verified", "blocked" ],
			default: "pending",
		},
		role: {
			type: String,
			enum: [ "client", "admin" ],
			default: "client"
		},
	},
	{ timestamps: true }
);
const User = mongoose.model( "User", userSchema );

module.exports = User;
