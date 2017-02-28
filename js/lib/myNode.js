"use strict";
var express = require("express");
var xssec = require("sap-xssec");
var passport = require("passport");
var xsHDBConn = require("sap-hdbext");
var xsenv = require("sap-xsenv");
var orm = require("./orm");
var async = require("async");

module.exports = function(){
	var app = express(); 

//configure HANA 
	var options = Object.assign({redirectUrl: "/index.xsjs"}, 
		xsenv.getServices({
			uaa: { tag: "xsuaa" },
			hana: { tag: "hana" }
		})
	);

   passport.use("JWT", new xssec.JWTStrategy(options.uaa));
   app.use(passport.initialize());
   app.use(
		passport.authenticate("JWT", {session: false}),
		xsHDBConn.middleware(options.hana)
	);
	
//Hello Router
	app.route("/").get(function(req, res) {
	    res.send("Hello World Node.js");
	});
	
	app.route("/hi").get(function(req, res){
		res.send("Hiya");	
	});
	
	app.route("/product/:productId").get(orm.getProduct);
	
	app.route("/about").get(function(req, res){
		res.send("about");	
	});	
	
	app.route("/dummy").get(function(req, res){
	    var client = req.db;
	    client.prepare("select SESSION_USER from \"bgg.db::DUMMY\" ",
	    function (err, statement){
	        statement.exec([], 
	        function (err, results) {
	            if (err){
	    	        res.type("text/plain").status(500).send("ERROR: " + err);
	            }else{
	    	        var result = JSON.stringify( { Objects: results });
	    	        res.type("application/json").status(200).send(result);
	            }
	        } );
	   } );
	});
	
	app.route("/dummy2").get(function(req, res){
        var client = req.db;
        
        async.waterfall([
    	    function prepare(callback){
                client.prepare("select SESSION_USER from \"bgg.db::DUMMY\" ",
    		    function(err,statement){callback(null, err, statement);});
    	    },
    			  
    		function execute(err, statement, callback){
    	        statement.exec([], function(execErr, results){callback(null,execErr,results);});
    		},
    		
    		function response(err, results, callback){
    		    if(err){
    			    res.type("text/plain").status(500).send("ERROR: " + err);
    			}else{
    			    var result = JSON.stringify( { Objects: results });
    			    res.type("application/json").status(200).send(result);
    			}
    			callback();
    		} 
		]);
	});
	
   return app;
};