// server.js

var express  = require('express');
var app      = express();                   // create our app w/ express
var clientapp = express();
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var js2xmlparser = require('js2xmlparser');

// configuration =================

app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as jso

clientapp.use(express.static(__dirname + '/clientapp'));


// API configuration ============================
app.post('/generatebxf', function(req, res) {
	const obj = JSON.parse(req.body.json);

    var options = {
        format: {
            doubleQuotes: false,
            pretty: false
        }
    };

	// For testing purposes
	console.log(js2xmlparser.parse("BxfMessage", obj, options));

	// Return XML
	res.set('Content-Type', 'text/xml');
	res.send(js2xmlparser.parse("BxfMessage", obj, options));
})

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

clientapp.listen(9001);
console.log("ClientApp listening on port 9001");


