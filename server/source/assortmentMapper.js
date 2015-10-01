var model = require('../model/models.js');


//Resident, Assortment, Transaction

var getAllElementsFromCollection = function (collection, callback) {

    try {
        model[collection].find({}, function (err, data) {
            if (err) {
                return callback(err);
            }
            if (data == null) return callback();
            return callback(undefined, data);

        });
    } catch (ex) {

        return callback(new Error('no such collection', 1));
    }
};




exports.getAllElementsFromCollection = getAllElementsFromCollection;