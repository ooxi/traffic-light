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
 * @param {String} gui HTML GUI to return on /
 * 
 * @returns {http.Server} Unbound traffic light HTTP server
 */
var Server = function(get, set, gui) {
	var server = http.createServer();
	
	
	
	/**
	 * Invokes `get' and checks the result.
	 * 
	 * @returns {State} Current traffic light state
	 */
	var safe_get = function() {
		var state = get();
		
		if (!(state instanceof State)) {
			throw new Error("Invalid traffic light state `"+ state +"' returned by `"+ get +"'");
		}
		return state;
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
		var state = safe_get();
		
		var send_error = function(msg) {
			response.writeHead(http_status.BAD_REQUEST, {
				"Content-Type": "text/plain; charset=UTF-8"
			});
			response.end(msg, "UTF-8");
		};
		
		
		/* Parse request properties
		 */
		if (query.hasOwnProperty("red")) {
			if ("true" === query.red) {
				state = state.red(true);
			} else if ("false" === query.red) {
				state = state.red(false);
			} else {
				send_error("Invalid value `"+ query.red +"' for property `red'");
			}
		}
		
		if (query.hasOwnProperty("yellow")) {
			if ("true" === query.yellow) {
				state = state.yellow(true);
			} else if ("false" === query.yellow) {
				state = state.yellow(false);
			} else {
				send_error("Invalid value `"+ query.yellow +"' for property `yellow'");
			}
		}
		
		if (query.hasOwnProperty("green")) {
			if ("true" === query.green) {
				state = state.green(true);
			} else if ("false" === query.green) {
				state = state.green(false);
			} else {
				send_error("Invalid value `"+ query.green +"' for property `green'");
			}
		}
		
		
		/* Update traffic light status
		 */
		set(state);
		
		
		/* Send resulting traffic light state
		 */
		state = safe_get();
		
		response.writeHead(http_status.OK, {
			"Content-Type": "application/json; charset=UTF-8"
		});
		response.end(JSON.stringify({
			red:	state.red(),
			yellow:	state.yellow(),
			green:	state.green()
		}), "UTF-8");
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
