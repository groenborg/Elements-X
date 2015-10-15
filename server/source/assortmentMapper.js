var model = require('../model/models.js');


function createAssortment(assortmentItem, callback) {
    model.Assortment.create(assortmentItem, function (err, data) {
        if (err) return callback(err);
        if (data == null) return callback();
        return callback(undefined, data);

    });
}


function updateAssortmentItem(updatedItem, callback) {


}

module.exports = {
    createAssortment: createAssortment
};