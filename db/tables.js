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

exports.queryTable = async function(query, params) {
    return await db_query(query, params);
}

exports.doesUserExist = async function(username, password) {

    let statement = "SELECT * FROM USERS WHERE username = " + '"' + username + '" AND password=' + '"' + password + '"'
   return await db_all(statement);
}

async function db_all(query){
    return new Promise(function(resolve,reject){
        db.all(query, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
        });
    });
}

async function db_query(query, params){
    return new Promise(function(resolve,reject){
        db.query(query, params, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
        });
    });
}