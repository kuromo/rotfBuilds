var express = require('express');
var mongoose = require('mongoose')
var AC = require('../controllers/account.js');
var RC = require('../controllers/render.js');
//var userM = require('../models/index');

module.exports.controller = function(app) {

	app.get('/register', function(req, res, next) {
		var opt = RC.getPageOpt(req.session)

		res.render('user/register', opt);
	});

	app.post('/register', function(req, res, next) {
	/*	check('mail')
    .isEmail().withMessage('must be an email')
    .trim()
    .normalizeEmail()

    	check('usrName').exists()
*/



		AC.register({
			usrName: req.body.usrName,
			email: req.body.mail,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			passwordHash: req.body.pwd
		}, function(err, msg){
			if(!err){
				if(msg.success){
					req.session.usr = msg.extras.userProfileModel
					res.send({ redirect: '/profile' })
				}else{
					//TODO tell user
					console.log(msg)
				}
			}else{
				console.log(err)
			}
		})	
	});

	app.get('/login', function(req, res, next) {
		var opt = RC.getPageOpt(req.session)

		res.render('user/login', opt);
	});

	app.post('/login', function(req, res, next) {
		var sess = req.session
		
		AC.logon(req.body.usrName, req.body.pwd, function(err, msg){
			if(err){return console.log(err)}
			
			if(msg.success){
				req.session.usr = msg.extras.userProfileModel
				req.flash('success', 'Successfully logged in.');
				res.send({ redirect: '/profile' })
			}else{
				//TODO tell user
				console.log(msg)
			}
		})
	});

	app.get('/logout', function(req, res, next) {

		req.session.destroy(function(err) {
			if(err) {
				console.log(err);
			} 
			res.redirect('/')
			
		});
	});

	app.get('/profile', function(req, res, next) {
		var sess = req.session

		if(sess.usr){
			AC.checkSess(req.session.usr,function(err, msg){
				if(err){return console.log(err)}
				
				if(msg.success){
					var user= msg.extras.user
					var opt = RC.getPageOpt(req.session)

					opt.name= user.firstName + " " + user.lastName + "(" + user.usrName +")"
					opt.links= [ {link: "/logout", desc: "logout"} ]
					

					res.render('user/profile', opt);
				}else{
					//TODO tell user
					console.log(msg)
				}
			})
		}else{
			res.redirect('/login');
		}		
	});

	app.get('/forgot', function(req, res, next) {
		var opt = RC.getPageOpt(req.session)

		res.render('user/forgot', opt);
	});

	app.post('/forgot', function(req, res, next) {
		AC.forgot(req.body.mail, req.headers.host, function(err, msg){
			if(err){return console.log(err)}

			if(msg.success){
				res.redirect('/')
			}else{
				//TODO tell user
				console.log(msg)
			}
		})
	});

	app.get('/reset/:token', function(req, res) {
		AC.showReset(req.params.token, function(err, msg){
			if(err){return console.log(err)}

			if(msg.success){
				var opt = RC.getPageOpt(req.session)

				res.render('user/reset', opt);
			}else{
				//TODO tell user
				console.log(msg)
			}
		})
	});

	app.post('/reset/:token', function(req, res) {
		AC.reset(req.params.token, req.body.pwd, function(err, msg){
			if(err){return console.log(err)}

			if(msg.success){
				res.redirect('/profile')
			}else{
				//TODO tell user
				console.log(msg)
			}
		})
	})

}





