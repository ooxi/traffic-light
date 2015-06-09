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

var colors = require("colors/safe");





/**
 * Creates a new immutable traffic light state.
 * 
 * @param {Boolean} red State of red light
 * @param {Boolean} yellow State of yellow light
 * @param {Boolean} green State of green light
 * 
 * @returns {State} Traffic light state
 */
var State = function(red, yellow, green) {
	var _red = !!red;
	var _yellow = !!yellow;
	var _green = !!green;
	
	
	
	
	
	/**
	 * Gets the state of the red light or returns a new state instance with
	 * red changed to the desired state.
	 * 
	 * @param {Boolean|undefined} redState New desired state (optional)
	 * @returns {Boolean|State} Current red state or new state object with
	 *     red changed to `redState'
	 */
	this.red = function(redState) {
		if ("undefined" === typeof(redState)) {
			return _red;
		}
		return new State(redState, this.yellow(), this.green());
	};



	/**
	 * Gets the state of the yellow light or returns a new state instance
	 * with yellow changed to the desired state.
	 * 
	 * @param {Boolean|undefined} yellowState New desired state (optional)
	 * @returns {Boolean|State} Current yellow state or new state object
	 *     with yellow changed to `yellowState'
	 */
	this.yellow = function(yellowState) {
		if ("undefined" === typeof(yellowState)) {
			return _yellow;
		}
		return new State(this.red(), yellowState, this.green());
	};
	
	
	
	/**
	 * Gets the state of the green light or returns a new state instance
	 * with green changed to the desired state.
	 * 
	 * @param {Boolean|undefined} greenState New desired state (optional)
	 * @returns {Boolean|State} Current green state or new state object with
	 *     green changed to `greenState'
	 */
	this.green = function(greenState) {
		if ("undefined" === typeof(greenState)) {
			return _green;
		}
		return new State(this.red(), this.yellow(), greenState);
	};
};



/**
 * @returns {String} Human readable trafficlight representation
 */
State.prototype.toString = function() {
	var red = this.red() ? colors.red("R") : "r";
	var yellow = this.yellow() ? colors.yellow("Y") : "y";
	var green = this.green() ? colors.green("G") : "g";
	
	return "[TrafficLight.State "+ red + yellow + green +"]";
};





/* Export public API
 */
module.exports = State;
