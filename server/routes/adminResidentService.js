var facade = require('../source/residentMapper');
var express = require('express');
var router = express.Router();


/*
 * request Handler
 * receives create request from client
 * */
router.post('/resident/create', function (request, response) {
    var newResident = request.body;

    facade.createResident(newResident, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "could not create"});
        } else {
            response.send(data);
        }
    });
});


module.exports = router;