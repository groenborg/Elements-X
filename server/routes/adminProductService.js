var express = require('express');
var router = express.Router();
var productManager = require('../source/productMapper');

/**
 * Creates a product
 * */
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

/**
 * Updates a product
 * */
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

/**
 * Restock a product - an update
 * */
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

/**
 * Deletes a product
 * @note: should not be used ( product should stay in history )
 * */
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