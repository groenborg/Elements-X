var mongoose = require('mongoose');
var residentData = require('./test-data.json');
var assortmentData = require('./assortment-data.json');

exports.fillDatabase = function (callback) {
    mongoose.connection.collection('residents').insert(residentData, callback);
};

exports.emptyDataBase = function (callback) {
    mongoose.connection.collection('residents').remove({}, callback);
};

exports.fillAssortment = function (callback) {
    mongoose.connection.collection('assortments').insert(assortmentData, callback);
};

exports.emptyAssortment = function (callback) {
    mongoose.connection.collection('assortments').remove({}, callback);
};