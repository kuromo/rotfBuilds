var nodemailer = require('nodemailer');
var env = require('dotenv').config()


var Sender = 'test@aniNode.com'
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: process.env.MAILER_TYPE,
        user: process.env.MAILER_USER,
        clientId: process.env.MAILER_CLIENTID,
        clientSecret: process.env.MAILER_CLIENTSECRET,
        refreshToken: process.env.MAILER_REFRESHTOKEN,
        accessToken: process.env.MAILER_ACCESSTOKEN
    }
});

module.exports.sendMail = function (mailOptions, callback) {
	mailOptions.from = Sender

	transporter.sendMail(mailOptions, function(err) {
		callback(err)
	});
}