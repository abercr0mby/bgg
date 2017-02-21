/*eslint no-console: 0*/
/*"use strict";

var http = require("http");
var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello World\n");
}).listen(port);

console.log("Server listening on port %d", port);*/


/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var xsjs  = require("sap-xsjs");
var xsenv = require("sap-xsenv");
var server = require("http").createServer();
var express = require("express");
var node = require("./src/myNode"); 

var port = process.env.PORT || 3000;

var options = {
	anonymous : true, // remove to authenticate calls
	redirectUrl : "/index.xsjs"
};
// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({ hana: {tag: "hana"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}
// configure UAA
try {
	options = Object.assign(options, xsenv.getServices({ uaa: {tag: "xsuaa"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

//Add XSJS to the base app
var xsjsApp = xsjs(options);

//Create base Express Server app
var app = express(); 
app.use("/node", node());
app.use(xsjsApp);

server.on("request", app);
server.listen(port, function(){
    console.log("HTTP Server: " + server.address().port );
});
