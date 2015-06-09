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

var State = require("../src/state.js");





exports.constructor = {
	ryg: function(test) {
		var state = new State(false, false, false);
		test.ok(!state.red());
		test.ok(!state.yellow());
		test.ok(!state.green());
		test.done();
	},
	
	ryG: function(test) {
		var state = new State(false, false, true);
		test.ok(!state.red());
		test.ok(!state.yellow());
		test.ok(state.green());
		test.done();
	},
	
	rYg: function(test) {
		var state = new State(false, true, false);
		test.ok(!state.red());
		test.ok(state.yellow());
		test.ok(!state.green());
		test.done();
	},
	
	rYG: function(test) {
		var state = new State(false, true, true);
		test.ok(!state.red());
		test.ok(state.yellow());
		test.ok(state.green());
		test.done();
	},
	
	Ryg: function(test) {
		var state = new State(true, false, false);
		test.ok(state.red());
		test.ok(!state.yellow());
		test.ok(!state.green());
		test.done();
	},
	
	RyG: function(test) {
		var state = new State(true, false, true);
		test.ok(state.red());
		test.ok(!state.yellow());
		test.ok(state.green());
		test.done();
	},
	
	RYg: function(test) {
		var state = new State(true, true, false);
		test.ok(state.red());
		test.ok(state.yellow());
		test.ok(!state.green());
		test.done();
	},
	
	RYG: function(test) {
		var state = new State(true, true, true);
		test.ok(state.red());
		test.ok(state.yellow());
		test.ok(state.green());
		test.done();
	}
};





exports.property = {
	red: function(test) {
		var oldState = new State(false, false, false);
		test.ok(!oldState.red());
		
		var newState = oldState.red(true);
		test.ok(!oldState.red());
		test.ok(newState.red());
		test.ok(oldState !== newState);
		
		test.done();
	},
	
	yellow: function(test) {
		var oldState = new State(false, false, false);
		test.ok(!oldState.yellow());
		
		var newState = oldState.yellow(true);
		test.ok(!oldState.yellow());
		test.ok(newState.yellow());
		test.ok(oldState !== newState);
		
		test.done();
	},
	
	green: function(test) {
		var oldState = new State(false, false, false);
		test.ok(!oldState.green());
		
		var newState = oldState.green(true);
		test.ok(!oldState.green());
		test.ok(newState.green());
		test.ok(oldState !== newState);
		
		test.done();
	}
};
