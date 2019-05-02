// Main file for the checklist-app application.


console.log("checklist-app by Jonathan Rich\n");



const yargs = require("yargs");

const server = require("./server.js");



// Default options
var options = {
	port: 8080
}



// Parse command line args
const argv = yargs.argv;

if (argv.port != null) {
	if (typeof argv.port != "number" || argv.port <= 0) throw Error("Port must be a positive integer.");
	options.port = argv.port;
}

console.log("-- Options --");
console.log(`Running on port ${options.port}`);
console.log("-".repeat(15) + "\n")



// Launch
console.log("Launching...");

server.start(options.port)
.then(() => console.log("Ready."));
