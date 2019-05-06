// Runs the express server.



// Methods
module.exports = {
  start   // Starts the server.
}



const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const database = require("./database.js");
const authentication = require("./authentication.js");
const users = require("./users.js");
const projects = require("./projects.js");



function start (port) {

  return database.load()
         .then(() => expressStart(port))

}


function expressStart (port) {

  return new Promise (resolve => {

      const app = express();

      app.use(bodyParser.json());
      app.use(cookieParser());

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
  app.get("/api/me", users.getMe); // Who am I
  app.get("/api/users", users.getUser); // Get user info
  app.post("/api/projects", projects.postProjects); // Save Projects
  app.get("/api/projects", projects.getProjects); // Read Projects

}
