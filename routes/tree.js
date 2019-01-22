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
		opt.classes = classes

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

var classes = {
	archer: {
		hp: 700,
		mp: 252,
		att: 75,
		def: 25,
		spd: 50,
		dex: 50,
		vit: 40,
		wis: 50
	},
	assassin: {
		hp: 700,
		mp: 278,
		att: 65,
		def: 20,
		spd: 80,
		dex: 75,
		vit: 35,
		wis: 70
	},
	huntress: {
		hp: 700,
		mp: 252,
		att: 75,
		def: 25,
		spd: 50,
		dex: 50,
		vit: 40,
		wis: 50
	},
	knight: {
		hp: 855,
		mp: 252,
		att: 50,
		def: 40,
		spd: 50,
		dex: 50,
		vit: 75,
		wis: 50
	},
	mystic: {
		hp: 670,
		mp: 385,
		att: 60,
		def: 25,
		spd: 60,
		dex: 80,
		vit: 40,
		wis: 75
	},
	necromancer: {
		hp: 670,
		mp: 385,
		att: 75,
		def: 25,
		spd: 50,
		dex: 60,
		vit: 30,
		wis: 75
	},
	ninja: {
		hp: 770,
		mp: 252,
		att: 70,
		def: 25,
		spd: 60,
		dex: 70,
		vit: 45,
		wis: 70
	},
	paladin: {
		hp: 855,
		mp: 252,
		att: 50,
		def: 35,
		spd: 55,
		dex: 45,
		vit: 40,
		wis: 75
	},
	priest: {
		hp: 670,
		mp: 385,
		att: 55,
		def: 25,
		spd: 55,
		dex: 60,
		vit: 40,
		wis: 75
	},
	rogue: {
		hp: 720,
		mp: 252,
		att: 60,
		def: 25,
		spd: 75,
		dex: 75,
		vit: 40,
		wis: 50
	},
	sorcerer: {
		hp: 670,
		mp: 385,
		att: 70,
		def: 25,
		spd: 60,
		dex: 60,
		vit: 75,
		wis: 75
	},
	trickster: {
		hp: 720,
		mp: 252,
		att: 80,
		def: 25,
		spd: 75,
		dex: 70,
		vit: 50,
		wis: 60
	},
	warrior: {
		hp: 855,
		mp: 252,
		att: 75,
		def: 30,
		spd: 50,
		dex: 50,
		vit: 75,
		wis: 50
	},
	wizard: {
		hp: 670,
		mp: 385,
		att: 75,
		def: 25,
		spd: 50,
		dex: 75,
		vit: 40,
		wis: 60
	}
}