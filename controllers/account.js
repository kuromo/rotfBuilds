var express = require('express');
var mongoose = require('mongoose')
var User = require('../models/users.js')
var UserProfileModel = require('../models/user-profile.js');
var ApiRes = require('../models/api-response.js');
var ApiMessages = require('../models/api-messages.js');
var ApiMsg = new ApiMessages();
var Mailer = require('../controllers/mailer.js');
var async = require('async');
var crypto = require('crypto');


module.exports.logon = function(usrName, password, callback) {

	User.findOne({$or: [{email: usrName}, {usrName: usrName} ]}, function(err, dbUser) {
		if (err) {
			return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.DB_ERROR } }));
		}
		if (!dbUser) {
			return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.EMAIL_NOT_FOUND } }));
		}
		dbUser.comparePw(password, function(err, isMatch) {
			if (err) {
				return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.DB_ERROR } }));
			}
			if (isMatch) {
				var userProfileModel = new UserProfileModel({
					id: dbUser.id,
					usrName: dbUser.usrName,
					email: dbUser.email,
					firstName: dbUser.firstName,
					lastName: dbUser.lastName,
					isAdmin: dbUser.isAdmin
				});

				return callback(err, new ApiRes({
					success: true, extras: {
						userProfileModel:userProfileModel
					}
				}));
			} else {
				return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.INVALID_PWD } }));
			}
		});
	});
};

module.exports.register = function (usrData, callback) {
	var newUser = new User(usrData)

	User.findOne({$or: [{email: newUser.email}, {usrName: newUser.usrName} ]}, function (err, dbUser) {
		if (err) {
			return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.DB_ERROR } }));
		}
		if (dbUser) {
			if(dbUser.email == newUser.email){
				return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.EMAIL_ALREADY_EXISTS } }));
			}else{
				return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.USERNAME_ALREADY_EXISTS } }));
			}
		} else {
			newUser.save(function (err, dbUser) {
				if (err) {
					return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.DB_ERROR } }));
				}

				var userProfileModel = new UserProfileModel({
					id: dbUser.id,
					usrName: dbUser.usrName,
					email: dbUser.email,
					firstName: dbUser.firstName,
					lastName: dbUser.lastName
				});

				return callback(err, new ApiRes({
					success: true, extras: {
						userProfileModel: userProfileModel
					}
				}));             
			});
		}
	});
};


module.exports.checkSess = function (sessUsr, callback) {
	var uProf = new UserProfileModel(sessUsr, true)
	uProf.getUser(function(err, user){
		if (err) { 
			return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.DB_ERROR } })) 
		}
		return callback(err, new ApiRes({ success: true, extras: { user: user } })) 
	})
}

module.exports.forgot = function (mail, host, callback) {
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			User.findOne({ email: mail }, function(err, user) {
				if (!user) {
					//req.flash('error', 'No account with that email address exists.');
					return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.FORGOT_MAIL_NOT_FOUND } }));
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				user.save(function(err) {
					done(err, token, user);
				});
			});
		},
		function(token, user, done) {

			var mailOptions = {
				to: mail,
				subject: 'Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + host + '/reset/' + token + '\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};
			Mailer.sendMail(mailOptions, function(err){
				done(err);
			})
		}
	], function(err) {
		if (err) return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.FORGOT_ERROR } }));

		return callback(err, new ApiRes({ success: true, extras: {} }));

	});
}

module.exports.showReset = function (resetTok, callback) {
	User.findOne({ resetPasswordToken: resetTok, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		if (err) return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.DB_ERROR } }));

		if (!user) {
			return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.RESET_TOKEN_ERROR } }));
			//req.flash('error', 'Password reset token is invalid or has expired.');
			//return res.redirect('/forgot');
		}

		return callback(err, new ApiRes({ success: true, extras: {} }));
	});
}


module.exports.reset = function (token, pw, callback) {
	async.waterfall([
		function(done) {
			User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
				if (err) return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.DB_ERROR } }));

				if (!user) {
					return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.RESET_TOKEN_ERROR } }));
					//req.flash('error', 'Password reset token is invalid or has expired.');
					//return res.redirect('/forgot');
				}

				user.passwordHash = pw;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;

				user.save(function(err) {
					//req.logIn(user, function(err) {
					console.log("saved "+user.password)
					done(err, user);
					//});
					//TODO ev login?
				});
			});
		},
		function(user, done) {

			var mailOptions = {
				to: user.email,
				subject: 'Your password has been changed',
				text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			Mailer.sendMail(mailOptions, function(err) {
				//	req.flash('success', 'Success! Your password has been changed.');
				done(err);
			});
		}
	], function(err) {
		if (err) return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.FORGOT_ERROR } }));

		return callback(err, new ApiRes({ success: true, extras: {} }));
	});
};