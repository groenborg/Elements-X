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

router.put('/product/restock', function (request, response) {
    if (request.body.product_id != null && isNaN(request.body.value)) {
        productManager.restockProduct(request.body, function (err, data) {
            if (err != null) {
                response.statusCode = 503;
                response.send({message: "unable to restock product"});
            } else {
                response.send(data);
            }
        });
    } else {
        response.statusCode = 400; // bad request
        response.send({message: "missing or invalid parameters"});
    }

});

router.delete('/product/delete', function (request, response) {
    var product = request.body;
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