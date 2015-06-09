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

var BeagleBoneBlack = require("../src/server/beagle-bone-black");
var collection_includes = require("lodash/collection/includes");





exports.testInvalidRedPin = function(test) {
	try {
		new BeagleBoneBlack({
			"red-pin":	"invalid-pin-name"
		});
		test.ok(false, "Expected invalid pin error");
		
	} catch (e) {
		test.ok(collection_includes(e.message, "Cannot find red pin"), "Unexpected error with message `"+ e.message +"'");
	}
	test.done();
};

exports.testValidRedPin = function(test) {
	new BeagleBoneBlack({
		"red-pin":	"USR3"
	});
	test.done();
};





exports.testInvalidYellowPin = function(test) {
	try {
		new BeagleBoneBlack({
			"yellow-pin":	"invalid-pin-name"
		});
		test.ok(false, "Expected invalid pin error");
		
	} catch (e) {
		test.ok(collection_includes(e.message, "Cannot find yellow pin"), "Unexpected error with message `"+ e.message +"'");
	}
	test.done();
};

exports.testValidYellowPin = function(test) {
	new BeagleBoneBlack({
		"yellow-pin":	"USR3"
	});
	test.done();
};





exports.testInvalidGreenPin = function(test) {
	try {
		new BeagleBoneBlack({
			"green-pin":	"invalid-pin-name"
		});
		test.ok(false, "Expected invalid pin error");
		
	} catch (e) {
		test.ok(collection_includes(e.message, "Cannot find green pin"), "Unexpected error with message `"+ e.message +"'");
	}
	test.done();
};

exports.testValidGreenPin = function(test) {
	new BeagleBoneBlack({
		"green-pin":	"USR3"
	});
	test.done();
};
