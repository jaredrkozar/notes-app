//import all of the node.js modules we need like express, path and sqlite3...
var sqlite3 = require('sqlite3').verbose();
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var app = express()

var db = new sqlite3.Database('notes_app.sql');

exports.createTables = function() {
    db.serialize(function() {
        //make the notes table
        db.run("CREATE TABLE IF NOT EXISTS USERS (username VARCHAR(255), password VARCHAR(50), email VARCHAR(50), user_id BIGINT(255) AUTO_INCREMENT, PRIMARY KEY (user_id))");
        db.run("CREATE TABLE IF NOT EXISTS NOTES (title VARCHAR(255), creationDate date, noteText VARCHAR(255), note_id BIGINT(255) AUTO_INCREMENT, user_id BIGINT(255), FOREIGN KEY(user_id) REFERENCES USERS(user_id)");
    }); //don't forget to close the database connection...
    db.close();
}

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//serve up the html-page aka our client side html/css/js
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
})
//set up a REST service attached to the sqlite3 DB via POST form
app.post('/post_user', function (req, res) {
    if(!req.body){ return res.sendStatus(400) }
    else{
        console.log(req.body);
        var db = new sqlite3.Database('mwd310_db.sql');
        db.serialize(function() {
            var stmt = db.prepare("INSERT INTO PWDS VALUES (?,?)");
            stmt.run(req.body.User,req.body.Password);
            stmt.finalize();
            //query the database to see what is inside it now....
            db.each("SELECT rowid AS id,user FROM PWDS", function(err, row) {
                console.log(row.id + ": " + row.user);
            });
        }); //don't forget to close the database connection...
        db.close();
        res.send({"message":"Good Work!"})
    }
})

//start up the REST services for GET and POST methods
app.listen(8080, () => console.log('Example app listening on port 8080!'))