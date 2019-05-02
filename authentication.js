// Dynamic express server endpoints for use in authentication.


// Methods
module.exports = {
  postUser,    // User Signup
  postSession, // User Login
}


const bcrypt = require("bcrypt");

const database = require("./database.js");


function generateToken () {

  const alph = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  var token = "";

  for (var i = 0; i < 50; i++) {

    token += alph[Math.floor(Math.random() * alph.length)];
  }

  return token;
}


function postUser (req, res) {

  var name = req.body.name;
  var email = req.body.email;
  var plaintextPassword = req.body.plaintextPassword;

  if (name == null || email == null || plaintextPassword == null) {   // If malformed, status 400 Bad Request
    res.status(400).end();
    return;
  }

  database.read("users", { "email": email })
  .then((data) => {
    if (data.length > 0) {  // If username conflict, status 409 Conflict
      res.status(409).end();
    }
    else {  // Otherwise store name, email, and hashed password, status 200 OK

      bcrypt.hash(plaintextPassword, 10)
      .then((passwordHash) => database.save("users", {"name": name, "email": email, "passwordHash": passwordHash }))
      .then(() => res.status(200).end());

    }
  });
}


function postSession (req, res) {

  var email = req.body.email;
  var plaintextPassword = req.body.plaintextPassword;

  if (email == null || plaintextPassword == null) {  // If malformed, status 400 Bad Request
    res.status(400).end();
    return;
  }

  database.read("users", { "email": email })
  .then((data) => {
    if (data.length == 0) {  // If user not found, status 403 Forbidden
      res.status(403).end();
    }
    else {

      var passwordHash = data[0].passwordHash;

      bcrypt.compare(plaintextPassword, passwordHash)
      .then((authenticated) => {
          if (authenticated) {  // If correct password, status 201 Created; generate session token
            var token = generateToken();

            database.save("sessions", { "email": email, "token": token })
            .then(() => res.status(201).end(token));
          }
          else {  // If incorrect password, status 403 Forbidden
            res.status(403).end();
          }
      });
    }
  });
}
