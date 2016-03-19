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

router.put('/product/update', function (request, response) {
    var item = request.body;

    productManager.updateProduct(item, function (err, productData) {
        if (err) {
            response.statusCode = 503;
            response.message = "could not update product";
            response.send({message: response.message});
        } else {
            response.send(productData);
        }
    });
});

router.delete('/product/delete', function (request, response) {
    var product = request.body;

    console.log(product);

    productManager.removeProduct(product, function (err, productData) {
        if (err) {
            response.statusCode = 503;
            response.message = "could not delete product";
            response.send({message: response.message});
        } else {
            response.send(productData);
        }
    });
});


module.exports = router;