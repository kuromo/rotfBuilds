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
		opt.bRunes = bRunes

		BC.getTree(res, 'tree', opt)




	});
}

var bRunes = {
	perf : {
		name: "Perfectionist", 
		color: "red"
	},
	consi : {
		name: "Consistent Onslaugh", 
		color: "red"
	},
	mana : {
		name: "Mana Hunger", 
		color: "red"
	},
	narr : {
		name: "Narrow Sighted Magic", 
		color: "red"
	},
	aggr : {
		name: "Aggressive Aggitator", 
		color: "red"
	},
	adre : {
		name: "Adrenaline Rush", 
		color: "red"
	},
	regen: {
		name: "Regeneration of the Brute",
		color: "green"
	},
	bid: {
		name: "Biding Time",
		color: "green"
	},
	arca: {
		name: "Arcane Surge",
		color: "green"
	},
	blood: {
		name: "Blood Pact",
		color: "green"
	},
	bulw: {
		name: "Bulwark of the Surgeon",
		color: "green"
	},
	bliss: {
		name: "Blissful Ignorance",
		color: "green"
	},
	resto : {
		name: "Restoration Temptation",
		color: "blue"
	},
	pot : {
		name: "Pot Head",
		color: "blue"
	},
	solo : {
		name: "Solo Thief",
		color: "blue"
	},
	eye : {
		name: "Eye for an Eye"	,
		color: "blue"
	},
	dread : {
		name: "Dreadstump's Greed",
		color: "blue"
	},
	rare : {
		name: "Rare Obsession",
		color: "blue"
	}
}