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

  if (!email || !projects) {

      res.end(400);
      return;
  }

  // In a real application, we should verify that projects is of correct structure. For brevity, I have left this out.


  database.save("projects", data)
  .then(() => {

    res.status(200).end();
  });

}

function getProjects (req, res) {

  var email = req.query.email;

  if (!email) {
    res.status(400).end();
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
}
