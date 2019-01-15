var express = require('express');
var mongoose = require('mongoose')
var RC = require('../controllers/render.js');
var AC = require('../controllers/account.js');
//var indexM = require('../models/index');

module.exports.controller = function(app) {

	app.get('/', function(req, res, next) {
		var opt = RC.getPageOpt(req.session)

		opt.links= [
			{link: "/register", desc: "register a user"},
			{link: "/login", desc: "login"},
			{link: "/logout", desc: "logout"},
			{link: "/profile", desc: "user profile"},
			{link: "/forgot", desc: "forgot password"}
		]



		res.render('index', opt);
	});

	app.get('/usrOnly', function(req, res, next) {
		var sess = req.session	
		var opt = RC.getPageOpt(req.session)

		opt.links= [
			{link: "/profile", desc: "user profile"}
		]

		if(sess.usr){
			AC.checkSess(req.session.usr,function(err, msg){
				if(err){return console.log(err)}
				
				if(msg.success){

					res.render('index', opt);
				}
			})
		}else{
			const error = new Error('401 Unauthorized!')
		    error.httpStatusCode = 401
		    return next(error)
		}		
	});

	app.get('/adminOnly', function(req, res, next) {
		var sess = req.session
		var opt = RC.getPageOpt(req.session)

		opt.links= [
			{link: "#", desc: "admin controlls"}
		]

		if(sess.usr.isAdmin){
			AC.checkSess(req.session.usr,function(err, msg){
				if(err){return console.log(err)}
				
				if(msg.success){

					res.render('index', opt);
				}
			})
		}else{
			const error = new Error('401 Unauthorized!')
		    error.httpStatusCode = 401
		    return next(error)
		}
	});
}