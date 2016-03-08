var db = require('mongoose');
var app = require('express')();
var config = require('../../config');


function connectToMongoDB(callback) {

    var uri = app.get('env') == "build" ? process.env.MONGOLAB : process.env.MONGO;

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