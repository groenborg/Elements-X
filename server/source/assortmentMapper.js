var model = require('../model/models.js');


function createAssortment(assortmentItem, callback) {
    model.Assortment.create(assortmentItem, function (err, data) {
        if (err) return callback(err);
        if (data == null) return callback();
        return callback(undefined, data);

    });
}


function updateAssortmentItem(updatedItem, callback) {

    model.Assortment.findOneAndUpdate({name: updatedItem.name}, {

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
    createAssortment: createAssortment,
    updateAssortmentItem: updateAssortmentItem
};