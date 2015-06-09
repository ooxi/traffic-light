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

var request = require("request");
var State = require("./state.js");
var URI = require("URIjs");





/**
 * Creates and initialized a traffic light network client.
 * 
 * @param {String} apiUri URI of traffic light server
 * 
 * @returns {Client} Traffic light client
 */
var Client = function(apiUri) {
	var _uri = new URI(apiUri);
	
	
	
	
	
	var parse_response = function(err, response, body, cb) {
			
		/* Propage HTTP errors
		 */
		if (err) {
			cb(err);
			return;
		}
		if (200 !== response.statusCode) {
			cb(new Error("Received unexpected HTTP status code `"+ response.statusCode +"'"));
			return;
		}

		/* Parse response
		 */
		try {
			var json = JSON.parse(body);

			if (!json.hasOwnProperty("red")) {
				throw new Error("Missing `red' property in response `"+ json +"'");
			} else if ("boolean" !== typeof(json.red)) {
				throw new Error("Invalid value `"+ json.red +"' of `red' property in response `"+ json +"'");
			}

			if (!json.hasOwnProperty("yellow")) {
				throw new Error("Missing `yellow' property in response `"+ json +"'");
			} else if ("boolean" !== typeof(json.yellow)) {
				throw new Error("Invalid value `"+ json.yellow +"' of `yellow' property in response `"+ json +"'");
			}

			if (!json.hasOwnProperty("green")) {
				throw new Error("Missing `green' property in response `"+ json +"'");
			} else if ("boolean" !== typeof(json.green)) {
				throw new Error("Invalid value `"+ json.green +"' of `green' property in response `"+ json +"'");
			}

			cb(null, new State(json.red, json.yellow, json.green));

		} catch (e) {
			cb(e);
			return;
		}
	};
	
	
	
	
	
	/**
	 * Reads current traffic light state.
	 * 
	 * @param {function(err, State)} cb Callback
	 */
	this.get = function(cb) {
		request(""+ _uri, function(err, response, body) {
			parse_response(err, response, body, cb);
		});
	};
	
	
	
	/**
	 * Updates the traffic light state.
	 * 
	 * @param {State} Desired traffic light state
	 * @param {function(err, State)} cb Callback
	 */
	this.set = function(state, cb) {
		var request_uri = new URI(_uri);
		
		var query = {
			red:	state.red() ? "true" : "false",
			yellow:	state.yellow() ? "true" : "false",
			green:	state.green() ? "true" : "false"
		};
		
		request(""+ request_uri.query(query), function(err, response, body) {
			parse_response(err, response, body, cb);
		});
	};
};





/* Export public API
 */
module.exports = Client;
