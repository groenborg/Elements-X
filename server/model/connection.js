var db = require('mongoose');
var app = require('express')();
var model = require('./models.js');

var localDataBase = "mongodb://localhost/elements";

/////// VERY BAD CODE - NEVER HARDCODE CONNECTIONS INTO FILES
var remoteDataBase = "mongodb://simon:127simon@ds037283.mongolab.com:37283/xserve";

//var url = "mongodb://localhost:27017/test";



function connectToMongoDB(callback) {

    var uri = app.get('env') == "build" ? remoteDataBase : localDataBase;

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