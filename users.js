// Dynamic express server routes for use in user information.


module.exports = {
  whoami, // "who am I?" - convenience function that gives an email for a given session token, or null if invalid token
  getMe,   // gets information about the current user
  getUser  // gets information about a specified user
}


const database = require("./database.js");


function whoami (token) {

  return new Promise (resolve => {

    database.read("sessions", { "token": token })
    .then((data) => {

      if (data.length == 0) resolve(null);  // token is invalid, resolve to null
      else resolve(data[0].email);  // token is valid
    });

  });
}

function getMe (req, res) {

  var token = req.cookies.token;

  if (token == null) {  // If missing token, status 403
    res.status(403).end();
  }

  whoami(token).then((email) => {

    if (email == null) {  // If invalid token, status 403
      res.status(403).end();
    }
    else {
      database.read("users", { "email": email })
      .then((data) => {

        var userData = { "email": data[0].email, "name": data[0].name, "isAdmin": data[0].isAdmin };

        res.status(200).end(JSON.stringify(userData));  // If everything OK, status 200; include information
      });
    }

  });
}

function getUser (req, res) {

  var email = req.query.email;

  database.read("users", { "email": email })
  .then((data) => {

    if (data.length == 0) {   // user doesn't exist, status 404 Not Found

      res.status(404).end();
    }
    else {

      var userData = { "email": data[0].email, "name": data[0].name, "isAdmin": data[0].isAdmin };

      res.status(200).end(JSON.stringify(userData));  // If everything OK, status 200; include information

    }

  });
}
