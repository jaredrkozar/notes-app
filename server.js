var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var db = require('./db');
var app = express();
var tables = require('./db/tables');

//middleware here-------------------------------------------
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'/public')));

app.get('/:userid/noteList', (req, res) => {
    res.sendFile(__dirname + '/public/html/mainview.html')
})

app.get('/createaccount', (req, res) => {
    res.sendFile(__dirname + '/public/html/createaccount.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html')
})

//password authentication with passport------------------------------------------------------------------
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

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
    const isInDB = await tables.usernameExists(req.body.username);
    if (isInDB == true) {
        alert("Another user has this username. Please choose another username");
    } else {
        tables.queryTable("INSERT INTO USERS (username, password) VALUES (?,?)", [req.body.username, req.body.password]);
    }
})

app.post('/login', async function (req, res) {
    const isInDB = await tables.doesUserExist(req.body.username, req.body.password);
    console.log(isInDB[0])
    console.log(isInDB[0].user_id + '/noteList')
    if (isInDB.length >= 1) {
        res.redirect(isInDB[0].user_id + '/noteList');
    } else {
        res.redirect('/login');
    }
})

app.listen(8080, function() {
    console.log('cookie/authentication app listening on port 8080!')
    tables.createTables();
});