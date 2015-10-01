var express = require('express');
var path = require('path');
var util = require('util');
var fs = require('fs');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../client/home.html'));
});

module.exports = router;
