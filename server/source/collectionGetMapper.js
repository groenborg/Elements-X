var model = require('../model/models.js');


function dataHandler(err, data, callback) {
    if (err) return callback(err);
    if (data == null) return callback();
    return callback(undefined, data);
}

var getAllElementsFromCollection = function (collection, callback) {
    try {
        model[collection].find({}, function (err, data) {
            return dataHandler(err, data, callback);
        });
    } catch (ex) {
        return callback(new Error('Type error', 1));
    }
};


var getOneElementFromCollection = function (collection, searchObject, callback) {

    try {
        model[collection].findOne(searchObject, function (err, data) {
            return dataHandler(err, data, callback);
        });
    } catch (ex) {
        return callback(new Error('Type error', 1));
    }
};

module.exports = {
    getAllElementsFromCollection: getAllElementsFromCollection,
    getOneElementFromCollection: getOneElementFromCollection
};
