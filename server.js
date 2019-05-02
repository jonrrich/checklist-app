// Runs the express server.



// Methods
module.exports = {
  start   // Starts the server.
}



const express = require("express");
const path = require("path");

const database = require("./database.js");



function start (port) {

  return database.load()
         .then(() => expressStart(port))

}


function expressStart (port) {

  return new Promise (resolve => {

      const app = express();

      expressDynamicContent(app);

      expressStaticContent(app);

      app.listen(port, resolve);

  });
}

function expressStaticContent (app) {

  app.use("/", express.static(path.join(__dirname, "public")));   // Serve static client files from the `public` folder

}

function expressDynamicContent (app) {

  app.get("/api", function (req, res) {

    res.send("Hello from API Server!");
  });
}
