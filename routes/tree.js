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
		opt.sRunes = sRunes
		opt.classes = classes

		BC.getTree(res, 'tree', opt)




	});
}

var sRunes = {
	hp:{
		name: "Mini Health",
		value: 30
	},
	mp:{
		name: "Mini Magic",
		value: 30
	},
	atk:{
		name: "Mini Strength",
		value: 3
	},
	def:{
		name: "Mini Protection",
		value: 3
	},
	spd:{
		name: "Mini Mobility",
		value: 3
	},
	dex:{
		name: "Mini Precision",
		value: 3
	},
	vit:{
		name: "Mini Spirit",
		value: 3
	},
	wis:{
		name: "Mini Enlightenment",
		value: 3
	}
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
		stats:{
			hp: 700,
			mp: 252,
			atk: 75,
			def: 25,
			spd: 50,
			dex: 50,
			vit: 40,
			wis: 50
		},
		weapon:"bow",
		armor:"leather",
		ability:"quiver"
	},
	assassin: {
		stats:{
			hp: 700,
			mp: 278,
			atk: 65,
			def: 20,
			spd: 80,
			dex: 75,
			vit: 35,
			wis: 70
		},
		weapon:"dagger",
		armor:"leather",
		ability:"poison"
	},
	huntress: {
		stats:{
			hp: 700,
			mp: 252,
			atk: 75,
			def: 25,
			spd: 50,
			dex: 50,
			vit: 40,
			wis: 50
		},
		weapon:"bow",
		armor:"leather",
		ability:"trap"
	},
	knight: {
		stats:{
			hp: 855,
			mp: 252,
			atk: 50,
			def: 40,
			spd: 50,
			dex: 50,
			vit: 75,
			wis: 50
		},
		weapon:"sword",
		armor:"plate",
		ability:"shield"
	},
	mystic: {
		stats:{
			hp: 670,
			mp: 385,
			atk: 60,
			def: 25,
			spd: 60,
			dex: 80,
			vit: 40,
			wis: 75
		},
		weapon:"staff",
		armor:"cloth",
		ability:"orb"
	},
	necromancer: {
		stats:{
			hp: 670,
			mp: 385,
			atk: 75,
			def: 25,
			spd: 50,
			dex: 60,
			vit: 30,
			wis: 75
		},
		weapon:"staff",
		armor:"cloth",
		ability:"skull"
	},
	ninja: {
		stats:{
			hp: 770,
			mp: 252,
			atk: 70,
			def: 25,
			spd: 60,
			dex: 70,
			vit: 45,
			wis: 70
		},
		weapon:"katana",
		armor:"leather",
		ability:"star"
	},
	paladin: {
		stats:{
			hp: 855,
			mp: 252,
			atk: 50,
			def: 35,
			spd: 55,
			dex: 45,
			vit: 40,
			wis: 75
		},
		weapon:"sword",
		armor:"plate",
		ability:"seal"
	},
	priest: {
		stats:{
			hp: 670,
			mp: 385,
			atk: 55,
			def: 25,
			spd: 55,
			dex: 60,
			vit: 40,
			wis: 75
		},
		weapon:"wand",
		armor:"cloth",
		ability:"tome"
	},
	rogue: {
		stats:{
			hp: 720,
			mp: 252,
			atk: 60,
			def: 25,
			spd: 75,
			dex: 75,
			vit: 40,
			wis: 50
		},
		weapon:"dagger",
		armor:"leather",
		ability:"cloak"
	},
	sorcerer: {
		stats:{
			hp: 670,
			mp: 385,
			atk: 70,
			def: 25,
			spd: 60,
			dex: 60,
			vit: 75,
			wis: 75
		},
		weapon:"wand",
		armor:"cloth",
		ability:"scepter"
	},
	trickster: {
		stats:{
			hp: 720,
			mp: 252,
			atk: 80,
			def: 25,
			spd: 75,
			dex: 70,
			vit: 50,
			wis: 60
		},
		weapon:"dagger",
		armor:"leather",
		ability:"prism"
	},
	warrior: {
		stats:{
			hp: 855,
			mp: 252,
			atk: 75,
			def: 30,
			spd: 50,
			dex: 50,
			vit: 75,
			wis: 50
		},
		weapon:"sword",
		armor:"plate",
		ability:"helmet"
	},
	wizard: {
		stats:{
			hp: 670,
			mp: 385,
			atk: 75,
			def: 25,
			spd: 50,
			dex: 75,
			vit: 40,
			wis: 60
		},
		weapon:"staff",
		armor:"cloth",
		ability:"spell"			
	}
}