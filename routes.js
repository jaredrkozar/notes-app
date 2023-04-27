var express = require('express');
var router = express.Router();

router.get('/noteList', (req, res) => {
    res.sendFile(__dirname + '/public/html/mainView.html')
})

router.get('/createaccount', (req, res) => {
    res.sendFile(__dirname + '/public/html/createaccount.html')
})

router.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html')
})