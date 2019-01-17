var express = require('express');
var mongoose = require('mongoose')
var async = require('async');
var RC = require('../controllers/render.js');
var BC = require('../controllers/backend.js');

module.exports.controller = function(app) {

	app.get('/tree', function (req, res, next) {
		var opt = RC.getPageOpt(req.session)
		opt.treeTitle = "Skill Tree",
		opt.treeDesc = "allocate points and check your power",
		opt.points = 0

		BC.getTree(res, 'tree', opt)




	});
}