var model = require('../model/models.js');


//Resident, Assortment, Transaction


function dataErrMapperHandler(err, data, callback) {
    if (err) return callback(err);
    if (data == null) return callback();
    return callback(undefined, data);
}

var getAllElementsFromCollection = function (collection, callback) {

    try {
        model[collection].find({}, function (err, data) {
            return dataErrMapperHandler(err, data, callback);
        });
    } catch (ex) {

        return callback(new Error('no such collection', 1));
    }
};


var getOneElementFromCollection = function (collection, searchObject, callback) {

};

exports.getAllElementsFromCollection = getAllElementsFromCollection;