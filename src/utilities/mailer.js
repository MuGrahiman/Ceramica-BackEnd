const { Transporter } = require("../configs/mailer.config");
const env = require("../configs/env.config");

/**
 * Sends a verification email to the specified email address.
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} emailBody - The HTML content of the email.
 * @returns {Promise} - A promise that resolves with the email sending result or rejects with an error.
 */
exports.sendMail = (email, subject, emailBody) => {
    return new Promise((resolve, reject) => {
        Transporter.sendMail(
            {
                from: env.Mailer_Mail,
                to: email,
                subject,
                html: emailBody,
            },
            (err, result) => {
                if (err) {
                    // Reject the promise if there is an error
                    reject(err);
                } else {
                    // Resolve the promise with the result
                    resolve(result);
                }
            }
        );
    });
};