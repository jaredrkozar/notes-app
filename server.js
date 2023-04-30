var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var db = require('./db');
var app = express();
var tables = require('./db/tables');
const cors = require('cors');

app.get('/:userid/noteList', (req, res) => {
    res.sendFile(__dirname + '/public/html/mainview.html')
})

app.get('/createaccount', (req, res) => {
    res.sendFile(__dirname + '/public/html/createaccount.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html')
})


//middleware here-------------------------------------------
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'/public')));

app.get('/:userid/fetchNotes', (req, res) => {
    const notes = tables.fetchAllNotes(req.params.userid)
    res.json("notes");
})

//password authentication with passport------------------------------------------------------------------
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// app.get('/logout',
//   function(req, res){
//     req.logout();
//     res.redirect('/');
// });
//
// app.get('/profile',
//   require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//     res.redirect('/logout');
// });

//handle the login route from the username/password client form

app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("Error!"));
//----------------------------------------------------------------------------------

app.post('/createaccount', async function (req, res) {
    const isInDB = await tables.queryTable("SELECT COUNT(username) AS num_users FROM USERS WHERE username = (?)", [req.body.username]);
    if (isInDB.num_users >= 1) {
        console.log("Another user has this username. Please choose another username");
        res.redirect('/createaccount');
    } else {
        tables.queryTable("INSERT INTO USERS (username, password) VALUES (?,?)", [req.body.username, req.body.password]);
        const isInDB = await tables.doesUserExist(req.body.username, req.body.password);
        res.redirect(isInDB[0].user_id + '/noteList');
    }
})

app.post('/login', async function (req, res) {
    const isInDB = await tables.doesUserExist(req.body.username, req.body.password);
    if (isInDB.length >= 1) {
        res.redirect(isInDB[0].user_id + '/noteList');
    } else {
        res.redirect('/login');
    }
})

app.use(cors({
    origin: 'http://localhost:8080'
}));

app.post('/saveNote', async function (req, res) {
    console.log("req")
    console.log(req)
    console.log(req.params)
    console.log(req.body)
    console.log(req.url)
    // tables.queryTable("INSERT INTO NOTES (title, creationDate, noteText) VALUES (?,?,?)", [req.body.username, req.body.password]);
})

app.listen(8080, function() {
    console.log('cookie/authentication app listening on port 8080!')
    tables.createTables();
});