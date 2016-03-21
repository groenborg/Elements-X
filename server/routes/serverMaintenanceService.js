var fs = require('fs');
var express = require('express');
var router = express.Router();


/**
 * @UNUSED
 * Server log
 * */
router.get('/log', function (request, response) {
    fs.readFile("access.log", {encoding: 'utf-8'}, function (err, data) {
        response.send({
            log: data
        });
    });
});

module.exports = router;