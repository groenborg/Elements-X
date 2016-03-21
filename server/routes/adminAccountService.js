var express = require('express');
var transactionManager = require('../source/transactionMapper');
var accountManager = require('../source/accountMapper');
var router = express.Router();

/**
 * refill the residents balance
 * */
router.post('/resident/refill', function (request, response) {
    var refillObject = request.body;
    var residentId = refillObject.resident_id;

    transactionManager.residentBalanceRefillTransaction(residentId, refillObject, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "Could not refill account"});
        } else {
            response.send(data);
        }
    });
});


/**
 * Updates the available products in a account
 * */
router.put('/account/upavail', function (request, response) {
    var data = request.body;

    accountManager.updateAvailableProducts(data, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "service unavailable";
            response.send({message: "Could not refill account"});
        } else {
            response.send(data);
        }
    });
});


/**
 * purchase an item from storage
 * */
router.put('/account/purchase', function (request, response) {
    var stockPurchaseDTO = request.body;
    transactionManager.purchaseFromStock(stockPurchaseDTO, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "could not purchase";
            response.send({message: "Could not purchase from stock"});
        } else {
            response.send(data);
        }
    });
});

router.put('/cbs/withdraw', function (request, response) {
    var withdrawDTO = request.body;
    accountManager.withdrawFromCBS(withdrawDTO, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "could not withdraw";
            response.send({message: "Could not withdraw from cbs"});
        } else {
            response.send(data);
        }
    });
});

router.get('/account/latest', function (request, response) {
    transactionManager.getLatestStockPurchases(function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "no stock purchases";
            response.send({message: "could not find stock purchases"});
        } else {
            response.send(data);
        }
    });
});

router.get('/account/history/:id', function (request, response) {
    transactionManager.getStockPurchaseHistory(request.params.id, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.statusMessage = "no stock purchases";
            response.send({message: "could not find stock purchases"});
        } else {
            response.send(data);
        }
    });
});


module.exports = router;