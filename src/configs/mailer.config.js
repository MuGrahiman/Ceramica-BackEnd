const nodemailer = require("nodemailer");
const env = require('./env.config')

// ----------mail transporter----------------
exports.Transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: env.Mailer_Mail,
		pass: env.Mailer_Token,
	},
});

