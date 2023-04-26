//import all of the node.js modules we need like express, path and sqlite3...
var sqlite3 = require('sqlite3');

let db = new sqlite3.Database('notesapp.sqlite', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

exports.createTables = function() {
    db.serialize(function() {
        //make the notes table
        db.run("CREATE TABLE IF NOT EXISTS USERS (username VARCHAR(255), password VARCHAR(50), user_id INTEGER PRIMARY KEY ASC)");
        db.run("CREATE TABLE IF NOT EXISTS NOTES (title VARCHAR(255), creationDate date, noteText VARCHAR(255))");
    }); //don't forget to close the database connection...
}

exports.queryTable = function(query, params) {
    db.serialize(function() {
        //make the notes table
        db.run(query, params);
    });
}

exports.usernameExists = async function(username) {

    let statement = "SELECT * FROM USERS WHERE username = " + '"' + username + '"'
    let isInDB = await db_all(statement);
    return isInDB.length >= 1;
}

async function db_all(query){
    return new Promise(function(resolve,reject){
        db.all(query, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
        });
    });
}