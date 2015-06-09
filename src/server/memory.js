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
	 * @return {State} Current state
	 */
	this.get = function() {
		return self.state;
	};
	
	
	/**
	 * Traffic light server set handler
	 * 
	 * @param {State} state Desired traffic light state
	 */
	this.set = function(state) {
		self.state = state;
	};
};





/* Export public API
 */
module.exports = Memory;
