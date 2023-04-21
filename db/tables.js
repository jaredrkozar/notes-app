//import all of the node.js modules we need like express, path and sqlite3...
var sqlite3 = require('sqlite3');
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var app = express()

let db = new sqlite3.Database('notesapp.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

exports.createTables = function() {
    db.serialize(function() {
        //make the notes table
        db.run("CREATE TABLE IF NOT EXISTS USERS (username VARCHAR(255), password VARCHAR(50), email VARCHAR(50), user_id BIGINT(255), PRIMARY KEY (user_id))");
        db.run("CREATE TABLE IF NOT EXISTS NOTES (title VARCHAR(255), creationDate date, noteText VARCHAR(255), note_id BIGINT(255), user_id BIGINT(255), FOREIGN KEY(user_id) REFERENCES USERS(user_id), PRIMARY KEY (note_id))");
    }); //don't forget to close the database connection...
    db.close();
}

console.log("Tables created")
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
//serve up the html-page aka our client side html/css/js
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
})
//set up a REST service attached to the sqlite3 DB via POST form
app.post('/new_user', function (req, res) {
    if(!req.body){ return res.sendStatus(400) }
    else{
        db.serialize(function() {
            var stmt = db.prepare("INSERT INTO USERS VALUES (?, ?, ?)");
            stmt.run(req.body.username,req.body.password, req.body.email);
            stmt.finalize();
        }); //don't forget to close the database connection...
        db.close();
        res.send({"message":"You created a new user!"})
    }
})

app.post('/new_note', function (req, res) {
    if(!req.body){ return res.sendStatus(400) }
    else{
        db.serialize(function() {
            var stmt = db.prepare("INSERT INTO NOTES VALUES (?, ?, ?)");
            stmt.run(req.body.title,req.body.date, req.body.text);
            stmt.finalize();
        }); //don't forget to close the database connection...
        db.close();
        res.send({"message":"You created a new note!"})
    }
})