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
        if (app.get('env') == 'production')
            console.log("Connected to database");
    });
}


function closeMongoDB(callback) {
    db.connection.close(callback);
    if (app.get('env') == 'production')
        console.log("closing database");
}


module.exports = {
    connectToMongoDB: connectToMongoDB,
    closeMongoDB: closeMongoDB

};