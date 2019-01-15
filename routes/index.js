var express = require('express');
var mongoose = require('mongoose')
var RC = require('../controllers/render.js');
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
}