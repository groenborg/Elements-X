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

module.exports = router;