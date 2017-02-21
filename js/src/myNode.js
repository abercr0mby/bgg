"use strict";
var express = require("express");
module.exports = function(){
	var app = express(); 
//Hello Router
	app.route("/")
	  .get(function(req, res) {
	    res.send("Hello World Node.js");
	});
	
	app.route("/hi").get(function(req, res){
		res.send("Hiya");	
	});
	
	app.route("/about").get(function(req, res){
		res.send("about");	
	});	
	
   return app;
};