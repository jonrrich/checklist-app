console.log("checklist-app by Jonathan Rich\n");



const yargs = require("yargs");
const express = require("express");
const path = require("path");



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

console.log(`Running on port ${options.port}\n`);



// Start express server
const app = express();

app.use("/", express.static(path.join(__dirname, "public")));

app.listen(options.port, () => console.log("Express server started."));
