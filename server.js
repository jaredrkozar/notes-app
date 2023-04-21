var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var db = require('./db');
var app = express();
var tables = require('./db/tables');

//middleware here-------------------------------------------
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname,'/client')));

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
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
});
app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("Error!"));
//----------------------------------------------------------------------------------

//set cookie
app.get('/set_cookie', function(req, res){
    console.log('cookie set request');
	res.cookie('richard', '10',{expire : new Date() + 1}).send('Cookie is set');
});

//delete cookie
app.delete('/delete_cookie', function(req,res){
    console.log('cookie set request');
    res.clearCookie('richard');
    res.send('Cookie deleted');
});

//get the cookie
app.get('/get_cookie', function(req, res) {
    console.log("Cookies :  ", req.cookies);
});

app.listen(8080, function() {
    console.log('cookie/authentication app listening on port 8080!')
    tables.createTables();
});