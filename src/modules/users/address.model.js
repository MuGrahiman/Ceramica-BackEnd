const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			// required: true,
		},
		lastName: {
			type: String,
			// required: true,
		},
		phoneNo: {
			type: String,
			// required: true,
		},
		houseName: {
			type: String,
			// required: true,
		},
		street: {
			type: String,
			// required: true,
		},
		city: {
			type: String,
			// required: true,
		},
		state: {
			type: String,
			// required: true,
		},
		district: {
			type: String,
			// required: true,
		},
		country: {
			type: String,
			// required: true,
		},
		postCode: {
			type: String,
			// required: true,
		},
		profilePic: {
			type: String,
			// required: true,
		},
	},
	{ timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
