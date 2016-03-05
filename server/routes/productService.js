var express = require('express');
var router = express.Router();
var productManager = require('../source/productMapper');
var collectionManager = require('../source/collectionGetMapper');

router.get('/product/all', function (request, response) {
    collectionManager.getAllElementsFromCollection('Product', function (err, productData) {
        if (err) {
            response.statusCode = 404;
            response.message = "products not found";
            response.send({message: response.message});
        } else {
            console.log(productData);
            response.send(productData);
        }
    });
});


module.exports = router;