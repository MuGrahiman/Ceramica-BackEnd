require("dotenv").config();

module.exports = {
	Port: process.env.PORT || 5000,
	MongoDB_USER: process.env.MONGODB_USER,
	MongoDB_PASS: encodeURIComponent(process.env.MONGODB_PASS),
	MongoDB_CLUSTER: process.env.MONGODB_CLUSTER,
	MongoDB_DB: process.env.MONGODB_DB,
	JWT_SECRET: process.env.JWT_SECRET_KEY,
	Admin_User : process.env.ADMIN_USER,
	Admin_Password:process.env.ADMIN_PASSWORD,
	Mailer_Mail:process.env.MAILER_MAIL,Mailer_Token:process.env.MAILER_TOKEN,
	Stripe_Secret_Key: process.env.STRIPE_SECRET_KEY,

};
 