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

var DefaultCallback = require("./default-callback.js");
var State = require("../state.js");





/**
 * Sample implementation of traffic light server, will keep state in memory.
 * 
 * @returns {Memory}
 */
var Memory = function() {
	var self = this;
	
	
	
	/**
	 * Current state
	 */
	this.state = new State(false, false, false);
	
	
	/**
	 * Traffic light server get handler
	 * 
	 * @param {function(err, TrafficLight.State)} cb Will be invoked with
	 *     current traffic light state
	 */
	this.get = function(cb) {
		cb = cb ? cb : DefaultCallback("[TrafficLight.Server.Memory] Getting state failed");
		
		process.nextTick(function() {
			cb(null, self.state);
		});
	};
	
	
	/**
	 * Traffic light server set handler
	 * 
	 * @param {TrafficLight.State} state Desired traffic light state
	 * @param {function(err)} cb Will be invoked as soon as desired traffic
	 *     light state is set
	 */
	this.set = function(state, cb) {
		cb = cb ? cb : DefaultCallback("[TrafficLight.Server.Memory] Setting state failed");
		
		process.nextTick(function() {
			self.state = state;
			cb(null);
		});
	};
};





/* Export public API
 */
module.exports = Memory;
