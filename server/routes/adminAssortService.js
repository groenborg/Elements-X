var express = require('express');
var router = express.Router();
var assortmentManager = require('../source/assortmentMapper');
var collectionManager = require('../source/collectionGetMapper');


router.post('/assortment/create', function (request, response) {
    var item = request.body;

    assortmentManager.createAssortment(item, function (err, assortmentData) {
        if (err) {
            response.statusCode = 503;
            response.message = "could not create";
            response.send({message: response.message});
        } else {
            response.send(assortmentData);
        }
    });
});


module.exports = router;