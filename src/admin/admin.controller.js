const User = require("../users/user.model");
const env = require("../configs/env.config");
const { generateJWToken } = require("../utilities/auth");

exports.Login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (email !== env.Admin_User || password !== env.Admin_Password) {
			return res.status(404).send({ message: "Invalid Credentials" });
		}

		const token = await generateJWToken({ 
			id: env.Admin_User,
			email: env.Admin_Password,
			role: "admin",
		});

		return res.status(200).json({
			message: "Authentication successful",
			token: token,
		});
	} catch (error) {
		console.error("Failed to login as admin", error);
		res.status(401).send({ message: "Failed to login as admin" });
	}
};

// exports.register = register = async (req,res)=>{
//     try {

//         const admin =  await User.create({
//             "username": "admin",
//             "password": "admin",
//             "role": "admin"
//         });
//         return res.status(200).json({
//             message: "Registration successful",
//             user: {
//                 username: admin.username,
//                 role: admin.role
//             }
//         })
//     } catch (error) {
//     }

// }
