var express = require('express');
var transaction = require('../source/transactionMapper');
var router = express.Router();

/**
 * User purchase from the kitchen purchase section
 * */
router.post('/user/purchase', function (request, response) {
    var purchase = request.body;
    var residentId = purchase.resident_id;
    
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