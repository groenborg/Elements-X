var model = require('../model/models.js');
var ObjectId = require('mongoose').Types.ObjectId;

function createProduct(product, callback) {

    model.Sequence.findAndModify({_id: 'product_counter'}, [], {$inc: {sequence_value: 100}}, {}, function (err, next) {
        if (err) return callback(err);
        if (next == null) return callback();

        product.product_id = next.value.sequence_value;
        model.Product.create(product, function (err, data) {
            if (err) return callback(err);
            if (data == null) return callback();
            return callback(undefined, data);
        });
    });
}


function updateProduct(updatedProduct, callback) {

    model.Product.findOneAndUpdate({product_id: updatedProduct.product_id}, {

        name: updatedProduct.name,
        description: updatedProduct.description,
        in_stock: updatedProduct.in_stock,
        purchase_price: updatedProduct.purchase_price,
        retail_price: updatedProduct.retail_price,
        box_size: updatedProduct.box_size

    }, {new: true}, function (err, item) {

        console.log(err);

        if (err) return callback(err);
        if (item == null) return callback();
        return callback(undefined, item);
    });
}


function removeProduct(product, callback) {
    model.Product.findOneAndRemove({product_id: product.product_id}, function (err, data) {
        if (err) return callback(err);
        if (data == null) return callback();
        return callback(undefined, data);
    });
}

module.exports = {
    createProduct: createProduct,
    updateProduct: updateProduct,
    removeProduct: removeProduct
};
