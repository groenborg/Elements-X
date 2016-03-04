var express = require('express');
var router = express.Router();
var collectionManager = require('../source/collectionGetMapper');


router.get('/account/all', function (request, response) {
    collectionManager.getAllElementsFromCollection('Account', function (err, accountData) {
        if (err) {
            response.statusCode = 503;
            response.message = "could not get";
            response.send({message: response.message});
        } else {
            response.send(accountData);
        }
    });
});


module.exports = router;