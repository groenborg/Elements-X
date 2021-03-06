var residentManager = require('../source/residentMapper');
var express = require('express');
var router = express.Router();


/**
 * Creates a resident
 * */
router.post('/resident/create', function (request, response) {
    var newResident = request.body;
    residentManager.createResident(newResident, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "could not create"});
        } else {
            response.send(data);
        }
    });
});

/**
 * Updates a resident
 * @note: only specific field are available for updates
 * */
router.put('/resident/update', function (request, response) {
    residentManager.updateResident(request.body, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "could not update resident"});
        } else {
            response.send(data);
        }
    });
});

router.put("/resident/disable", function (request, response) {
    residentManager.disableResident(request.body, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "could not update resident"});
        } else {
            response.send(data);
        }
    });
});


/**
 * Gets history for a resident
 * */
router.get('/resident/history/:id', function (request, response) {
    residentManager.getResidentHistory(request.params.id, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "could not retrieve history"});
        } else {
            response.send(data);
        }
    });
});


module.exports = router;