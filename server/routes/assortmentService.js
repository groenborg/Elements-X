var express = require('express');
var router = express.Router();
var assortmentManager = require('../source/assortmentMapper');
var collectionManager = require('../source/collectionGetMapper');


router.get('/assortment/all', function (request, response) {
    collectionManager.getAllElementsFromCollection('Assortment', function (err, assortmentData) {
        if (err) {
            response.statusCode = 404;
            response.message = "not found";
            response.send({message: response.message});
        }
        response.send(assortmentData);
    });
});


module.exports = router;