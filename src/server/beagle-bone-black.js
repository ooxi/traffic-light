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
var bonescript = require("bonescript");
var collection_includes = require("lodash/collection/includes");
var DefaultCallback = require("./default-callback.js");
var State = require("../state.js");





/**
 * Checks if `subject' is an array of strings and every string in the array is a
 * valid Beagle Bone Black pin name
 * 
 * @param {String} color Color of pin for error message
 * @param {String[]) subject List of pin names
 * 
 * @throws {Error} iff subject is not a valid list of pin names
 */
var verify_pin_names = function(color, subject) {
	if (!Array.isArray(subject)) {
		throw new Error("Pin names should be given as array of pin names but `"+ typeof(subject) +"' is given");
	}
	var valid_pin_names = Object.keys(bonescript.bone.pins);
	
	for (var i = 0; i < subject.length; ++i) {
		var pin_name = subject[i];
		
		if (!collection_includes(valid_pin_names, pin_name)) {
			throw new Error("Cannot find "+ color +" pin #"+ i +" `"+ pin_name +"' in beagle bone black pins `"+ valid_pin_names +"'");
		}
	}
};



/**
 * Invokes `bonescript.pinMode' on every pin in `pin_names'
 * 
 * @param {String[]) pin_names List of pins whoes state should be changed
 * @param {INPUT|INPUT_PULLUP|OUTPUT} mode Desired pin mode
 */
var set_pin_modes = function(pin_names, mode) {
	pin_names.forEach(function(pin_name) {
		bonescript.pinMode(pin_name, mode);
	});
};





/**
 * Traffic light connected to a beagle bone black. By default the on board LEDs
 * will be used as signal, but the pins can be overwritten by settings.
 * 
 * @param {String} settings ['red-pins'] Pin names for red light (default
 *     ['USR0'])
 * @param {String} settings ['yellow-pins'] Pin names for yellow light (default
 *     ['USR1'])
 * @param {String} settings ['green-pins'] Pin names for green light (default
 *     ['USR2'])
 * 
 * @returns {BeagleBoneBlack} Instance with `get' and `set' handler compatible
 *     to `TrafficLight.Server' requirements
 */
var BeagleBoneBlack = function(settings) {
	
	/* Copy settings to immutable structure
	 */
	var RED_PINS = ["USR0"];
	var YELLOW_PINS = ["USR1"];
	var GREEN_PINS = ["USR2"];
	
	if ("red-pins" in settings) {
		RED_PINS = settings["red-pins"];
	}
	if ("yellow-pins" in settings) {
		YELLOW_PINS = settings["yellow-pins"];
	}
	if ("green-pins" in settings) {
		GREEN_PINS = settings["green-pins"];
	}
	
	
	/* Verify pin names
	 */
	verify_pin_names("red", RED_PINS);
	verify_pin_names("yellow", YELLOW_PINS);
	verify_pin_names("green", GREEN_PINS);
	
	
	/* Configure pins as output
	 */
	set_pin_modes(RED_PINS, bonescript.OUTPUT);
	set_pin_modes(YELLOW_PINS, bonescript.OUTPUT);
	set_pin_modes(GREEN_PINS, bonescript.OUTPUT);
	
	
	
	
	
	/**
	 * @param {function(err, TrafficLight.State)} Will be invoked with
	 *     current traffic light state
	 */
	this.get = function(cb) {
		cb = cb ? cb : DefaultCallback("[TrafficLight.Server.BeagleBoneBlack] Getting state failed");
		
		process.nextTick(function() {
			console.log("[TrafficLight.Server.BeagleBoneBlack] Getting state not supported, will return dummy values");
			cb(null, new State(false, false, false));
		});
//		var read_pin = function(pin) {
//			return function(cb) {
//				bonescript.digitalRead(pin, function(x) {
//					cb(x.err, x.value);
//				});
//			};
//		};
//		
//		
//		async.parallel({
//			red:	read_pin(RED_PINS),
//			yellow:	read_pin(YELLOW_PINS),
//			green:	read_pin(GREEN_PINS)
//		}, function(err, results) {
//			if (err) {
//				cb(err);
//			} else {
//				cb(null, new State(results.red, results.yellow, results.green));
//			}
//		});
	};
	
	
	
	/**
	 * Updates the current traffic light state.
	 * 
	 * @param {TrafficLight.State} state Desired traffic light state
	 * @param {function(err)} cb Will be invoked after traffic light state
	 *     was changed
	 */
	this.set = function(state, cb) {
		cb = cb ? cb : DefaultCallback("[TrafficLight.Server.BeagleBoneBlack] Setting state failed");
		
		var write_pin = function(pin, value) {
			return function(cb) {
				bonescript.digitalWrite(pin, value, function(x) {
					cb(x.err);
				});
			};
		};
		
		var write_pins = function(pins, value) {
			return function(cb) {
				var tasks = [];
				
				pins.forEach(function(pin) {
					tasks.push(write_pin(pin, value));
				});
				async.parallel(tasks, cb);
			};
		};
		
		
		async.parallel([
			write_pins(RED_PINS, state.red() ? bonescript.LOW : bonescript.HIGH),
			write_pins(YELLOW_PINS, state.yellow() ? bonescript.LOW : bonescript.HIGH),
			write_pins(GREEN_PINS, state.green() ? bonescript.LOW : bonescript.HIGH)
		], function(err) {
			cb(err);
		});
	};
};



/* Export public API
 */
module.exports = BeagleBoneBlack;
