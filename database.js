// Provides an interface to interact with the database.

// In this case, the diskdb functions are synchronous, so using Promises to make these functions asynchronous is unnecessary.
// However, if I were to replace this test database with a scalable solution for production, these functions would be asynchronous.
// In order to prepare for this eventuality, I define the interface in an asynchronous manner.
// In the future, this file could be replaced with a MongoDB implementation, for example, without affecting the rest of the code.


// Methods
module.exports = {
  load,   // Connects to the database and prepares for reading and writing. Must be called first.
  read,   // Reads a given collection of the database, and optionally filters the results with a query.
  save,   // Saves data into a collection of the database, updating instead if a document with the same unique key already exists.
  remove  // Deletes data from a collection of the database, given the unique key of the document.
}


var diskdb = require("diskdb");
var path = require("path");



const dbpath = path.join(__dirname, "data");            // Store data in the `data` folder
const collections = ["users", "sessions", "projects"];  // List of collections in our database
const uniqueFields = {                                  // Specifies which data field should be enforced to be unique for each collection
                     "users": "email",
                     "sessions": "email",
                     "projects": "email"
                   };

var db;

function load () {

  return new Promise(resolve => {

    db = diskdb.connect(dbpath, collections);

    resolve();
  });
}

function read (collection, query) {

  return new Promise(resolve => {

    resolve(db[collection].find(query));
  });
}

function save (collection, data) {

  return new Promise(resolve => {

    var uniqueField = uniqueFields[collection];
    var query = {};
    query[uniqueField] = data[uniqueField];

    db[collection].update(query, data, { upsert: true });

    resolve();
  });
}

function remove (collection, key) {

  return new Promise(resolve => {

    var uniqueField = uniqueFields[collection];
    var query = {};
    query[uniqueField] = key;

    db[collection].remove(query);

    resolve();
  });
}
