// const mongoose = require( "mongoose" );
// const bcrypt = require( "bcryptjs" );
// const { USER_ROLES, USER_ROLES_ARRAY } = require( "../../utilities/constants" );


// //TODO: rewrite the model status 
// const userSchema = new mongoose.Schema(
// 	{
// 		firstName: {
// 			//TODO: required,trim
// 			type: String,
// 			default: null,
// 		},
// 		lastName: {
// 			//TODO: required,trim
// 			type: String,
// 			default: null,
// 		},
// 		email: {
// 			type: String,
// 			required: true,
// 			unique: true,
// 		},
// 		password: {
// 			//TODO: required,minLength
// 			type: String,
// 			default: null,
// 		},
// 		guId: {//google unique id 
// 			type: String,
// 			default: null,
// 		},
// 		fbId: {//face book unique id 
// 			type: String,
// 			default: null,
// 		},
// 		status: {
// 			//TODO: refactor the array as an constant
// 			type: String,
// 			//TODO: remove the blocked from the array
// 			enum: [ "pending", "registered", "verified", "blocked" ],
// 			default: "pending",
// 		},
// 		role: {
// 			type: String,
// 			enum: USER_ROLES_ARRAY,
// 			default: USER_ROLES.CLIENT
// 		},
// 		//TODO: add isBlocked field
// 		avatar: {
// 			public_id: {
// 				type: String,
// 				// required: true,
// 			},
// 			url: {
// 				type: String,
// 				// required: true,
// 				default: "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1741285501~exp=1741289101~hmac=d629ec566545ef3b552d0a991e687ad2ed1aab9f352ae82b2df97cd3ad059148&w=740"
// 			},
// 			type: {
// 				type: String,
// 				// required: true,
// 			},
// 		}
// 	},
// 	{ timestamps: true }
// );
// const User = mongoose.model( "User", userSchema );

// module.exports = User;
