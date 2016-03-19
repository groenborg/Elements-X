var model = require('../model/models.js');
var ObjectId = require('mongoose').Types.ObjectId;


/**
 * Creates a product
 * @note: Uses a counter which must be created by a script
 * @params: product object, callback function
 * */
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

/**
 *  Updates a current product
 *  @params: update object, callback function
 * */
function updateProduct(updatedProduct, callback) {
    model.Product.findOneAndUpdate({product_id: updatedProduct.product_id}, {
        name: updatedProduct.name,
        description: updatedProduct.description,
        in_stock: updatedProduct.in_stock,
        purchase_price: updatedProduct.purchase_price,
        retail_price: updatedProduct.retail_price,
        box_size: updatedProduct.box_size
    }, {new: true}, function (err, item) {
        if (err) return callback(err);
        if (item == null) return callback();
        return callback(undefined, item);
    });
}

/**
 * increments in_stock field in product document
 * object{product_id: Number, amount: Number}
 * @params: restock object, callback function
 * */
function restockProduct(product, callback) {
    model.Product.findOneAndUpdate({product_id: product.product_id}, {
        $inc: {in_stock: product.amount}
    }, {new: true}, function (err, data) {
        return callback(err, data);
    });
}

/**
 * deletes a product from the collection
 * @note: deleting a product will leave dirty data in the documents
 * @Params: product object containing product_id, callback function
 * */
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
    removeProduct: removeProduct,
    restockProduct: restockProduct
};
