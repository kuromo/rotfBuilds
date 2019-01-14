var express = require('express');
var mongoose = require('mongoose')
//var indexM = require('../models/index');

module.exports.controller = function(app) {

  app.get('/', function(req, res, next) {
    res.render('index', { 
      hTitle: 'recipeManager',
      searchTxt: "Search",
      links: [
        {link: "/register", desc: "register a user"},
        {link: "/login", desc: "login"},
        {link: "/logout", desc: "logout"},
        {link: "/profile", desc: "user profile"},
        {link: "/forgot", desc: "forgot password"}
      ]

    });
  });
  app.get('/test', function(req, res, next) {
    res.render('test', {
      nav1: "Import"
     });
  });

}