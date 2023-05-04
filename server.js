var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var app = express();
var tables = require('./db/tables');
const cors = require('cors');
var passport = require('passport');
const LocalStrategy = require("passport-local");

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
app.use(passport.initialize());

app.get('/:userid/:folderName/fetchNotes', async function (req, res) {
    const notes = await tables.fetchAllNotes(req.params.userid, req.params.folderName)
    res.json(notes);
})

app.get('/:userid/fetchAllFolders', async function (req, res) {
    const folders = await tables.returnUniqueFolders(req.params.userid)
    res.json(folders);
})

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

app.use(cors({
    origin: 'http://localhost:8080'
}));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    tables.doesUserExist(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/error' }),
    function(req, res) {
        res.redirect(req.user.user_id + '/noteList');
    });

app.post('/createaccount', async function(req, res, next) {
    await tables.queryTable('INSERT INTO users (username, password) VALUES (?, ?)', [req.body.username, req.body.password]);
    const getUserID = await fetchUserID(req.body.username)
    var user = {
        id: getUserID,
        username: req.body.username
    };
    req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect(user.id + '/noteList');
    });
});

app.post('/saveNote', async function (req, res) {
    let ts = Date.now();
    if (req.body.body.noteid != undefined) {
        await tables.queryTable("UPDATE NOTES SET title=(?), noteText=(?), folderName=(?) WHERE user_id=(?) AND note_id=(?)", [req.body.body.title, req.body.body.text, req.body.body.folderName, req.body.body.userid, req.body.body.noteid])
    } else {
        await tables.queryTable("INSERT INTO NOTES (title, noteText, folderName, user_id) VALUES (?,?,?,?)", [req.body.body.title, req.body.body.text, req.body.body.folderName, req.body.body.userid]);
    }
})

app.post('/deleteNote', async function (req, res) {
    if (req.body.body.noteid != undefined) {
        await tables.queryTable("DELETE FROM NOTES WHERE user_id=(?) AND note_id=(?)", [req.body.body.userid, req.body.body.noteid])
    }
})

app.listen(8080, function() {
    console.log('cookie/authentication app listening on port 8080!')
    tables.createTables();
});

async function fetchUserID(username) {
    const id = await tables.queryTable("SELECT user_id from USERS where username=(?)", [username])
    return id.user_id
}