var express = require('express');
var mongoose = require('mongoose')
var RC = require('../controllers/render.js');
var AC = require('../controllers/account.js');
var BC = require('../controllers/backend.js');
//var indexM = require('../models/index');

module.exports.controller = function(app) {

	app.get('/backend', function(req, res, next) {
		var sess = req.session
		var opt = RC.getPageOpt(req.session)

		opt.links= [
			{link: "/importTree", desc: "import tree"}
		]

		if(sess.usr&&sess.usr.isAdmin){
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

	app.get('/getTree', function(req, res, next) {
		var tree = BC.getTree(res)
	});

	app.get('/importTree', function(req, res, next) {
		var sess = req.session
		var opt = RC.getPageOpt(req.session)

		if(sess.usr&&sess.usr.isAdmin){
			AC.checkSess(req.session.usr,function(err, msg){
				if(err){return console.log(err)}
				
				if(msg.success){

					res.render('admin/importTree', opt);
				}
			})
		}else{
			const error = new Error('401 Unauthorized!')
		    error.httpStatusCode = 401
		    return next(error)
		}
	});

	app.post('/importTree', function(req, res, next) {
		var sess = req.session


		if(sess.usr&&sess.usr.isAdmin){
			AC.checkSess(req.session.usr,function(err, msg){
				if(err){return console.log(err)}
				
				if(msg.success){

					BC.importNodes(req.body.tree)
				}
			})
		}else{
			const error = new Error('401 Unauthorized!')
		    error.httpStatusCode = 401
		    return next(error)
		}
	});
}