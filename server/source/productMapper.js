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


function updateProduct(updatedItem, callback) {


    model.Product.findOneAndUpdate({name: updatedItem.name}, {

        supply: updatedItem.supply,
        price: updatedItem.price,
        description: updatedItem.description

    }, {new: true}, function (err, item) {

        if (err) return callback(err);
        if (item == null) return callback();
        return callback(undefined, item);
    });

}

module.exports = {
    createProduct: createProduct,
    updateProduct: updateProduct
};
