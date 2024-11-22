const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	// role: {
	//     type: String,
	//     enum: ['user', 'admin'],
	//     required: true
	// }
});

// userSchema.pre('save', async function( next) {
//     if(!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// }
// )

const User = mongoose.model("User", userSchema);

module.exports = User;
