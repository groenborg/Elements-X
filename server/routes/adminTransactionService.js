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

router.get('/transaction/get/:limit', function (request, response) {
    var limit = request.params.limit;

    limit = limit == 0 ? 10 : limit;

    transaction.getAllTransactions(limit, function (err, data) {
        if (err) {
            response.statusCode = 404;
            response.statusMessage = "not found";
            response.send({message: "no transactions found"});
        } else {
            response.send(data);
        }
    })

});

module.exports = router;