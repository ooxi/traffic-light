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

var Client = require("../src/client.js");
var Memory = require("../src/server/memory.js");
var Server = require("../src/server.js");
var State = require("../src/state.js");





exports.testServer = function(test) {
	var memory = new Memory();
	var server = new Server(memory.get, memory.set);
	
	try {
		server.listen(0, function() {
			try {
				var api = "http://localhost:"+ this.address().port +"/api/";
				var client = new Client(api);

				client.set(new State(true, false, true), function(err, state) {
					try {
						test.ifError(err);

						test.ok(state instanceof State);
						test.ok(state.red());
						test.ok(!state.yellow());
						test.ok(state.green());

						test.ok(memory.state.red());
						test.ok(!memory.state.yellow());
						test.ok(memory.state.green());

						server.close();
						test.done();
					} catch (e) {
						test.ifError(e);
						server.close();
						test.done();
					}
				});
			} catch (e) {
				test.ifError(e);
				server.close();
				test.done();
			}
		});
	} catch (e) {
		test.ifError(e);
		test.done();
	}
};
