// Dynamic server routes for project information.


// Methods
module.exports = {

  postProjects,   // Save projects for a single user.
  getProjects     // Read projects for a single user.
}



const database = require("./database.js");



function postProjects (req, res) {


  var data = req.body;
  var email = data.email;
  var projects = data.projects;
  var token = req.cookies.token;

  if (!email || !projects) {

      res.status(400).end();
      return;
  }

  // In a real application, we should verify that projects is of correct structure. For brevity, I have left this out.



  if (!token) {
    res.status(403).end();
    return;
  }

  database.read("sessions", { "email": email })
  .then((sessionData) => {

    var validToken = sessionData[0].token;

    if (!validToken || token != validToken) {
      res.status(403).end();    // If invalid token, status 403 Forbidden
      return;
    }


    database.save("projects", data)
    .then(() => {

      res.status(200).end();
    });
  });

}

function getProjects (req, res) {

  var email = req.query.email;
  var token = req.cookies.token;

  if (!email) {
    res.status(400).end();
    return;
  }

  if (!token) {
    res.status(403).end();
    return;
  }

  database.read("sessions", { "email": email })
  .then((sessionData) => {

    var validToken = sessionData[0].token;

    if (!validToken || token != validToken) {
      res.status(403).end();    // If invalid token, status 403 Forbidden
      return;
    }

    database.read("projects", { "email": email })
    .then((data) => {

      var projects;

      if (!data[0] || !data[0].projects) {
        projects = [];
      }
      else {
        projects = data[0].projects;
      }

      res.status(200).end(JSON.stringify(projects));
    });
  });

}
