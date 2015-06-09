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

var BeagleBoneBlack = require("./server/beagle-bone-black.js");
var collection_includes = require("lodash/collection/includes");
var Memory = require("./server/memory.js");
var Server = require("./server.js");





/* Parse command line arguments
 */
var argv = require("yargs")
	.demand("engine")
	.describe("engine", "Traffic light engine (`memory' or `beagle-bone-black')")

	.default("port", 8080)
	.describe("port", "Port on with the network server should listen")


	.describe("beagle-bone-black.red-pin", "Name of pin for red light")
	.describe("beagle-bone-black.yellow-pin", "Name of pin for yellow light")
	.describe("beagle-bone-black.green-pin", "Name of pin for green light")
.argv;





/* In memory engine (useful for debugging and demonstration)
 */
if ("memory" === argv.engine) {
	var memory = new Memory();
	var server = new Server(memory.get, memory.set);


/* BeagleBone Black
 */
} else if ("beagle-bone-black" === argv.engine) {
	var settings = "beagle-bone-black" in argv
		? argv["beagle-bone-black"]
		: {};
	var bbb = new BeagleBoneBlack(settings);
	var server = new Server(bbb.get, bbb.set);

/* Unsupported engine
 */
} else {
	throw new Error("Invalid engine `"+ argv.engine +"'");
}



/* Start server on port
 */
server.listen(argv.port, function() {
	console.log("Started `"+ argv.engine +"' traffic light server on port `"+ this.address().port +"'");
});
