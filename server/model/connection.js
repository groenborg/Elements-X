var db = require('mongoose');
var app = require('express')();
var uri = "mongodb://localhost/elements";
//var url = "mongodb://localhost:27017/test";
var model = require('./models.js');


function connectToMongoDB(callback) {
    db.connect(uri, function (err) {
        if (err) console.log(err);
        callback();
    });

    db.connection.on('connected', function () {
        console.log("Connected to database");
    });
}


function closeMongoDB(callback) {
    db.connection.close(callback);
    console.log("closing database");
}


module.exports = {
    connectToMongoDB: connectToMongoDB,
    closeMongoDB: closeMongoDB

};