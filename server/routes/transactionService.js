var express = require('express');
var transaction = require('../source/transactionMapper');
var router = express.Router();


router.post('/user/purchase', function (request, response) {
    var purchase = request.body;
    var residentId = purchase.resident_id;

    //Adds a timestamp in none is set
    if (purchase.timestamp != null) {
        purchase.timestamp = Date.now();
    }

    transaction.residentPurchaseTransaction(residentId, purchase, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "No residents found"});

        } else {
            response.send(data);
        }
    });
});


router.post('/user/refill', function (request, response) {
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


module.exports = router;