const { Transporter } = require( "../configs/mailer.config" );
const env = require( "../configs/env.config" );

// Send the verification code via email
exports.sendMail = ( USER, OTP ) => {
	return new Promise( ( resolve, reject ) => {
		Transporter.sendMail(
			{
				from: env.Mailer_Mail,
				to: USER.email,
				subject: "OTP Verification Code",
				html: "<h1>" + OTP + "</h1>",
			},
			( err, data ) => {
				if ( err ) {
					reject( err );
				} else {
					console.log( "Mail sent successfully" );
					( data.success = "Mail sent successfully" )
					resolve( data );
				}
			}
		);
	} );
};
