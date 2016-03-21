var express = require('express');
var router = express.Router();
var collectionManager = require('../source/collectionGetMapper');

/**
 * @OPEN
 * Retrieves all products
 * */
router.get('/product/all', function (request, response) {
    collectionManager.getAllElementsFromCollection('Product', function (err, productData) {
        if (err) {
            response.statusCode = 404;
            response.message = "products not found";
            response.send({message: response.message});
        } else {
            response.send(productData);
        }
    });
});


module.exports = router;