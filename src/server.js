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

var async = require("async");
var fs = require("fs");
var http = require("http");
var http_status = require("http-status");
var State = require("./state.js");
var URI = require("URIjs");





/**
 * Creates a new HTTP server conforming to the traffic light protocol and
 * forwarding requests to handler functions.
 * 
 * @param {function() → State} get Read the current traffic light state
 * @param {function(State)} set Write a new traffic light state
 * @param {String|undefined} gui HTML GUI to return on /
 * 
 * @returns {http.Server} Unbound traffic light HTTP server
 */
var Server = function(get, set, gui) {
	var server = http.createServer();
	gui = gui ? gui : fs.readFileSync(require.resolve("./gui.html"));
	
	
	
	/**
	 * Invokes `get' and checks the result.
	 * 
	 * @param {function(err, State)} Will be invoked with current traffic
	 *     light state as soon as operation has completed
	 */
	var safe_get = function(cb) {
		get(function(err, state) {
			if (err) {
				cb(err);
				return;
			}
			if (!(state instanceof State)) {
				cb(new Error("Invalid traffic light state `"+ state +"' returned by `"+ get +"'"));
				return;
			}
			
			cb(null, state);
		});
	};
	
	
	
	/**
	 * Sends the traffic light GUI.
	 * 
	 * @param {http.ClientRequest} request
	 * @param {http.ServerResponse} response
	 */
	var handle_gui = function(request, response) {
		response.writeHead(http_status.OK, {
			"Content-Type": "text/html; charset=UTF-8"
		});
		response.end(gui, "UTF-8");
	};
	
	
	
	
	
	/**
	 * Parses an API request, updates the traffic light state and returns
	 * the resulting traffic light state.
	 * 
	 * @param {http.ClientRequest} request
	 * @param {http.ServerResponse} response
	 */
	var handle_api = function(request, response) {
		var query = new URI(request.url).query(true);
		
		
		/* Read current state from engine
		 */
		var read_state = function(callback) {
			safe_get(function(err, new_state) {
				if (err) return callback(err);
				
				callback(null, new_state);
			});
		};
		
		
		/* Parse request properties and updates a status object
		 * accordingly
		 */
		var read_query = function(state, callback) {
			if (query.hasOwnProperty("red")) {
				if ("true" === query.red) {
					state = state.red(true);
				} else if ("false" === query.red) {
					state = state.red(false);
				} else {
					cb(new Error("Invalid value `"+ query.red +"' for property `red'"));
					return;
				}
			}

			if (query.hasOwnProperty("yellow")) {
				if ("true" === query.yellow) {
					state = state.yellow(true);
				} else if ("false" === query.yellow) {
					state = state.yellow(false);
				} else {
					cb(new Error("Invalid value `"+ query.yellow +"' for property `yellow'"));
					return;
				}
			}

			if (query.hasOwnProperty("green")) {
				if ("true" === query.green) {
					state = state.green(true);
				} else if ("false" === query.green) {
					state = state.green(false);
				} else {
					cb(new Error("Invalid value `"+ query.green +"' for property `green'"));
					return;
				}
			}
			
			callback(null, state);
		};
		
		
		/* Update engine to reflect current state
		 */
		var write_state = function(state, callback) {
			set(state, function(err) {
				if (err) return callback(err);
				
				callback(null);
			});
		};
		
		
		
		/* 1. Read current state from engine
		 * 2. Update state object to reflect desired state (according to
		 *    client request
		 * 3. Write updated state to engine
		 * 4. Read updated state from engine
		 * 5. Return current state to client (or an error message)
		 */
		async.waterfall([
			read_state,
			read_query,
			write_state,
			read_state
			
		/* Return updated state to client
		 */
		], function(err, state) {
			
			/* Operation successful, return updated state object
			 */
			if (!err) {
				response.writeHead(http_status.OK, {
					"Content-Type": "application/json; charset=UTF-8"
				});
				response.end(JSON.stringify({
					red:	state.red(),
					yellow:	state.yellow(),
					green:	state.green()
				}), "UTF-8");
			
			/* Operation did not success, return error message
			 */
			} else {
				response.writeHead(http_status.BAD_REQUEST, {
					"Content-Type": "text/plain; charset=UTF-8"
				});
				response.end("Caught unexpected error of type `"+ typeof(err) +"'\n\n"+ err, "UTF-8");
			}
		});
	};
	
	
	
	
	
	/**
	 * Discard unkown requests.
	 * 
	 * @param {http.ClientRequest} request
	 * @param {http.ServerResponse} response
	 */
	var handle_unkown = function(request, response) {
		response.writeHead(http_status.NOT_FOUND, {
			"Content-Type": "test/plain; charset=UTF-8"
		});
		response.end("Cannot find `"+ request.url +"'", "UTF-8");
	};
	
	
	
	
	
	/**
	 * Handles request routing
	 * 
	 * @param {http.ClientRequest} request
	 * @param {http.ServerResponse} response
	 */
	server.on("request", function(request, response) {
		var uri = new URI(request.url);
		
		try {
			if ("/" === uri.path()) {
				handle_gui(request, response);
			} else if ("/api/" === uri.path()) {
				handle_api(request, response);
			} else {
				handle_unkown(request, response);
			}
		
		/* Make sure every connection is closed
		 */
		} catch (e) {
			response.end();
			console.log("[TrafficLight.Server] Caught unexpected error", e);
			throw e;
		}
	});
	
	
	
	/**
	 * Trun on all lights when server starts up.
	 */
	server.on("listening", function() {
		set(new State(true, true, true));
	});
	
	/**
	 * Turn off all lights when server shuts down.
	 */
	server.on("close", function() {
		set(new State(false, false, false));
	});

	
	
	/* Discard `this' and return created http.Server instance
	 */
	return server;
};



/* Export public API
 */
module.exports = Server;
