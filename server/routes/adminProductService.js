var express = require('express');
var router = express.Router();
var productManager = require('../source/productMapper');
var collectionManager = require('../source/collectionGetMapper');


router.post('/product/create', function (request, response) {
    var item = request.body;

    productManager.createProduct(item, function (err, productData) {
        if (err) {
            response.statusCode = 503;
            response.message = "could not create product";
            response.send({message: response.message});
        } else {
            response.send(productData);
        }
    });
});


module.exports = router;