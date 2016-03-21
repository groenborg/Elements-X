var facade = require('../source/residentMapper');
var express = require('express');
var router = express.Router();

/**
 * @OPEN
 * retrieves all residents
 * */
router.get('/getResidents', function (request, response) {
    facade.getAllResidents(function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "No residents found"});
            return;
        }
        response.send(data);
    })
});

/**
 * @OPEN
 * get kitchen groups
 * */
router.get('/getKitchenGroups', function (request, response) {
    facade.getKitchenGroups(function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "No residents found"});
            return;
        }
        response.send(data);
    });
});

module.exports = router;
