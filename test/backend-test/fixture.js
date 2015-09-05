var mongoose = require('mongoose');
var residentData = require('./test-data.json');

exports.fillDatabase = function (callback) {
    mongoose.connection.collection('residents').insert(residentData, callback);
};

exports.emptyDataBase = function (callback) {
    mongoose.connection.collection('residents').remove({}, callback);
};