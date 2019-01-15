var express = require('express');
var mongoose = require('mongoose')
var AC = require('../controllers/account.js');

module.exports.getPageOpt = function(session) {
	var options = {
		searchTxt: "Login"
	}
	if(session.usr){
		options.searchTxt= "Search"
		options.hTitle= 'rotfBuilds'

		return options
	}else{
		//no sess

		return options
	}
};

/* async routes
module.exports.safeAsync = (middleware) => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

app.get('/xxx', RC.safeAsync(async (req, res) => {
		var xxx = await xxx

	}))
	*/