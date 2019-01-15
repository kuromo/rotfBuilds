var express = require('express');
var mongoose = require('mongoose')
var AC = require('../controllers/account.js');

module.exports.getPageOpt = function(session) {
	var options = {
		searchTxt: "Login",
		navItems: [{link: "/tree", desc: "Tree"}],
		usrLinks: [
			{link: "/profile", desc: "Profile"},
			{link: "/logout", desc: "Logout"}
		]
	}
	if(session.usr){
		options.hasSess= true
		options.searchTxt= "Search"
		options.hTitle= 'rotfBuilds'
		options.navUsrWelc= 'Hi, ' + session.usr.firstName
		options.navItems.push({link: "/usrOnly", desc: "usrOnly"});

		if(session.usr.isAdmin){
			options.navItems.push({link: "/adminOnly", desc: "adminOnly"});

			return options
		}

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