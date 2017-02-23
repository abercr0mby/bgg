"use strict";
var express = require("express");
var xssec = require("sap-xssec");
var passport = require("passport");
//var passport = require("sap-e2e-trace").Passport;
var xsHDBConn = require("sap-hdbext");
var xsenv = require("sap-xsenv");
// var async = require("async");

module.exports = function(){
	var app = express(); 

/*   passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({uaa:{tag:"xsuaa"}}).uaa));
   app.use(passport.initialize());
   app.use(
		passport.authenticate("JWT", {session: false}),
		xsHDBConn.middleware()
	);*/
	
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
	
	app.route("/dummy")
	  .get(function(req, res){
	  	
	  	res.send("dummy");	
	  	
/*	  var client = req.db;
	  client.prepare(
	  "select SESSION_USER from \"bgg.db::DUMMY\" ",
	     function (err, statement){
	       statement.exec([],
	       function (err, results) {
	       if (err){
	    	 res.type("text/plain").status(500).send("ERROR: " + err);
	       }else{
	    	 var result = JSON.stringify( { Objects: results });
	    	 res.type("application/json").status(200).send(result);
	     } }  );
	   } );*/
	});	

   return app;
};