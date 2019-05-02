// Runs the express server.



// Methods
module.exports = {
  start   // Starts the server.
}



const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const database = require("./database.js");
const authentication = require("./authentication.js");



function start (port) {

  return database.load()
         .then(() => expressStart(port))

}


function expressStart (port) {

  return new Promise (resolve => {

      const app = express();

      app.use(bodyParser.json());

      expressDynamicContent(app);

      expressStaticContent(app);

      app.listen(port, resolve);

  });
}

function expressStaticContent (app) {

  app.use("/", express.static(path.join(__dirname, "public")));   // Serve static client files from the `public` folder

}

function expressDynamicContent (app) {

  app.post("/api/users", authentication.postUser);   // User Signup
  app.post("/api/sessions", authentication.postSession); // User Login

}
