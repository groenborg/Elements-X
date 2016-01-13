var express = require('express');
var transaction = require('../source/transactionMapper');
var router = express.Router();

router.post('/resident/refill', function (request, response) {
    var refillObject = request.body;
    var residentId = refillObject.resident_id;

    transaction.residentBalanceRefillTransaction(residentId, refillObject, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "Could not refill account"});

        } else {
            response.send(data);
        }
    });
});


router.post('/transaction/purchase', function (request, response) {
    var transactionDTO = request.body;
    transaction.buyFromStorage(transactionDTO, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "could not be created";
            response.send({message: "Could not purchase from storage"});
        } else {
            response.send(data);
        }
    });
});



module.exports = router;