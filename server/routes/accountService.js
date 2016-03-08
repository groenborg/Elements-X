var express = require('express');
var router = express.Router();
var collectionManager = require('../source/collectionGetMapper');
var accountManager = require('../source/accountMapper');


function mergeAccountAndProducts(account, products) {

    function getProduct(id) {
        for (var i = 0; i < products.length; ++i) {
            if (products[i].product_id == id) {
                return products[i];
            }
        }
    }

    function remove(product, id) {
        for (var i = 0; i < product.retail_price.length; ++i) {
            if (product.retail_price[i].account_id == id) {
                product.retail_price = product.retail_price[i];
                return product;
            }
        }
    }

    for (var i = 0; i < account.length; ++i) {
        for (var j = 0; j < account[i].available_products.length; ++j) {

            var product = JSON.parse(JSON.stringify(getProduct(account[i].available_products[j])));
            product = remove(product, account[i].account_id);
            account[i].available_products[j] = product;

        }
    }

    return account;
}

router.get('/account/all', function (request, response) {
    collectionManager.getAllElementsFromCollection('Account', function (err, accountData) {
        if (err) {
            response.statusCode = 503;
            response.message = "could not get";
            response.send({message: response.message});
        } else {

            collectionManager.getAllElementsFromCollection('Product', function (err, productData) {
                if (err) {
                    response.statusCode = 503;
                    response.message = "could not get";
                    response.send({message: response.message});
                } else {
                    var data = mergeAccountAndProducts(accountData, productData);
                    response.send(data);
                }
            });
        }
    });
});


router.get('/account/history/:accountId', function (request, response) {
    var accountId = request.params.accountId;

    accountManager.getAccountHistory(accountId, function (err, data) {
        if (err) {
            response.statusCode = 503;
            response.message = "could not get";
            response.send({message: response.message});
        } else {
            response.send(data);
        }
    });

});


module.exports = router;