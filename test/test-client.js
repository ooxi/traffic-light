/**
 * Copyright (c) 2015 ooxi
 *     https://github.com/ooxi/traffic-light
 *     violetland@mail.ru
 * 
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *  1. The origin of this software must not be misrepresented; you must not
 *     claim that you wrote the original software. If you use this software in a
 *     product, an acknowledgment in the product documentation would be
 *     appreciated but is not required.
 *
 *  2. Altered source versions must be plainly marked as such, and must not be
 *     misrepresented as being the original software.
 * 
 *  3. This notice may not be removed or altered from any source distribution.
 */
"use strict";

var Client = require("../src/client.js");
var collection_includes = require("lodash/collection/includes");
var http = require("http");
var State = require("../src/state.js");
var URI = require("URIjs");





/**
 * 
 * @param {String} mock_response
 * @param {function(err, state)} cb
 */
var testResponse = function(mock_response, cb) {
	var server = http.createServer()
	
	/* Send mock response response
	 */
	.on("request", function(request, response) {
		response.writeHead(200, {
			"Content-Type": "application/json; charset=UTF-8"
		});
		response.end(mock_response, "UTF-8");
	})
	
	/* Start server on random available port.
	 */
	.listen(0, function() {
		var port = this.address().port;
	
		try {
			var client = new Client("http://localhost:"+ port +"/");
		
			/* Get mock response from server and shut down
			 */
			client.get(function(err, state) {
				server.close();
				cb(err, state);
			});
		} catch (e) {
			server.close();
			cb(e);
		}
	});
};



exports.testSimpleGet = function(test) {
	testResponse("{\"red\": true, \"yellow\": false, \"green\": true}", function(err, state) {
		test.ifError(err);
		test.ok(state instanceof State, "`state' should be an instance of `TrafficLight.State' but is `"+ state +"'");
		
		test.ok(state.red());
		test.ok(!state.yellow());
		test.ok(state.green());
		
		test.done();
	});
};



var testGet = function(red, yellow, green) {
	return function(test) {
		var mock_response = JSON.stringify({
			red: red,
			yellow: yellow,
			green: green
		});
		
		testResponse(mock_response, function(err, state) {
			test.ifError(err);
			test.ok(state instanceof State, "`state' should be an instance of `TrafficLight.State' but is `"+ state +"'");

			test.ok(red === state.red());
			test.ok(yellow === state.yellow());
			test.ok(green === state.green());

			test.done();
		});
	};
};

exports.get = {
	ryg:	testGet(false, false, false),
	ryG:	testGet(false, false, true),
	rYg:	testGet(false, true, false),
	rYG:	testGet(false, true, true),
	Ryg:	testGet(true, false, false),
	RyG:	testGet(true, false, true),
	RYg:	testGet(true, true, false),
	RYG:	testGet(true, true, true)
};





var testSet = function(red, yellow, green) {
	return function(test) {
		var server = http.createServer()
		
		.on("request", function(request, response) {
			var uri = new URI(request.url);
			var query = uri.query(true);
			var query_keys = Object.keys(query);
			
			test.ok(query_keys.length === 3, "Expected exactly three keys but got `"+ query_keys +"'");
			test.ok(collection_includes(query_keys, "red"), "Did not find `red' in `"+ query_keys +"'");
			test.ok(collection_includes(query_keys, "yellow"), "Did not find `yellow' in `"+ query_keys +"'");
			test.ok(collection_includes(query_keys, "green"), "Did not find `green' in `"+ query_keys +"'");
			
			if (red) {
				test.equal(query.red, "true");
			} else {
				test.equal(query.red, "false");
			}
			
			if (yellow) {
				test.equal(query.yellow, "true");
			} else {
				test.equal(query.yellow, "false");
			}
			
			if (green) {
				test.equal(query.green, "true");
			} else {
				test.equal(query.green, "false");
			}
			
			response.writeHead(200, {
				"Content-Type": "application/json; charset=UTF-8"
			});
			response.end(JSON.stringify({
				red:	!red,
				yellow:	!yellow,
				green:	!green
			}), "UTF-8");
		})
		
		.listen(0, function() {
			var port = this.address().port;

			try {
				var client = new Client("http://localhost:"+ port +"/");

				/* Get mock response from server and shut down
				 */
				client.set(new State(red, yellow, green), function(err, state) {
					server.close();
					
					test.ifError(err);
					test.ok(state instanceof State, "`state' should be an instance of `TrafficLight.State' but is `"+ state +"'");

					test.ok(!red === state.red());
					test.ok(!yellow === state.yellow());
					test.ok(!green === state.green());
					
					test.done();
				});
			} catch (e) {
				server.close();
				test.ifError(e);
				test.done();
			}
		});
	};
};



exports.set = {
	ryg:	testSet(false, false, false),
	ryG:	testSet(false, false, true),
	rYg:	testSet(false, true, false),
	rYG:	testSet(false, true, true),
	Ryg:	testSet(true, false, false),
	RyG:	testSet(true, false, true),
	RYg:	testSet(true, true, false),
	RYG:	testSet(true, true, true)
};
