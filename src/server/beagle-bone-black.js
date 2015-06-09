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

var collection_includes = require("lodash/collection/includes");
var bonescript = require("bonescript");
var State = require("../state.js");





/**
 * Traffic light connected to a beagle bone black. By default the on board LEDs
 * will be used as signal, but the pins can be overwritten by settings.
 * 
 * @param {String} settings ['red-pin'] Pin name for red light (default 'USR0')
 * @param {String} settings ['yellow-pin'] Pin name for yellow light (default
 *     'USR1')
 * @param {String} settings ['green-pin'] Pin name for green light (default
 *     'USR2')
 * 
 * @returns {BeagleBoneBlack} Instance with `get' and `set' handler compatible
 *     to `TrafficLight.Server' requirements
 */
var BeagleBoneBlack = function(settings) {
	
	/* Copy settings to immutable structure
	 */
	var RED_PIN = "USR0";
	var YELLOW_PIN = "USR1";
	var GREEN_PIN = "USR2";
	
	if ("red-pin" in settings) {
		RED_PIN = ""+ settings["red-pin"];
	}
	if ("yellow-pin" in settings) {
		YELLOW_PIN = ""+ settings["yellow-pin"];
	}
	if ("green-pin" in settings) {
		GREEN_PIN = ""+ settings["green-pin"];
	}
	
	
	/* Verify pin names
	 */
	var pins = Object.keys(bonescript.bone.pins);
	
	if (!collection_includes(pins, RED_PIN)) {
		throw new Error("Cannot find red pin `"+ RED_PIN +"' in beagle bone black pins `"+ pins +"'");
	}
	if (!collection_includes(pins, YELLOW_PIN)) {
		throw new Error("Cannot find yellow pin `"+ YELLOW_PIN +"' in beagle bone black pins `"+ pins +"'");
	}
	if (!collection_includes(pins, GREEN_PIN)) {
		throw new Error("Cannot find green pin `"+ GREEN_PIN +"' in beagle bone black pins `"+ pins +"'");
	}
	
	
	/* Configure pins as output
	 */
	bonescript.pinMode(RED_PIN, bonescript.OUTPUT);
	bonescript.pinMode(YELLOW_PIN, bonescript.OUTPUT);
	bonescript.pinMode(GREEN_PIN, bonescript.OUTPUT);
	
	
	
	
	
	/**
	 * @returns {TrafficLight.State} The current traffic light state
	 */
	this.get = function() {
		return new State(false, false, false);
	};
	
	
	
	/**
	 * Updates the current traffic light state.
	 * 
	 * @param {State} state Desired traffic light state
	 */
	this.set = function(state) {
		bonescript.digitalWrite(RED_PIN, state.red() ? bonescript.HIGH : bonescript.LOW);
		bonescript.digitalWrite(YELLOW_PIN, state.yellow() ? bonescript.HIGH : bonescript.LOW);
		bonescript.digitalWrite(GREEN_PIN, state.green() ? bonescript.HIGH : bonescript.LOW);
	};
};



/* Export public API
 */
module.exports = BeagleBoneBlack;
