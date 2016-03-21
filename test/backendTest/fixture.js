var mongoose = require('mongoose');
var residentData = require('./residents.json');
var productData = require('./products.json');
var accountData = require('./accounts.json');

exports.fillResidents = function (callback) {
    mongoose.connection.collection('residents').insert(residentData, callback);
};

exports.fillProducts = function (callback) {
    mongoose.connection.collection('products').insert(productData, callback);
};

exports.fillAccounts = function (callback) {
    mongoose.connection.collection('accounts').insert(accountData, callback);
};

exports.emptyProducts = function (callback) {
    mongoose.connection.collection('products').remove({}, callback);
};

exports.emptyResidents = function (callback) {
    mongoose.connection.collection('residents').remove({}, callback);
};

exports.emptyAccounts = function (callback) {
    mongoose.connection.collection('accounts').remove({}, callback);
};

exports.emptyStock = function (callback) {
    mongoose.connection.collection('stock_purchases').remove({}, callback);
};

exports.emptyCounters = function (callback) {
    mongoose.connection.collection('sequences').remove({}, callback);
};