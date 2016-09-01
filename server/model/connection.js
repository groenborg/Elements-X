var db = require('mongoose');
var app = require('express')();


function connectToMongoDB(callback) {

    if (app.get('env') == "build") {

    } else {
        require('../../config');
    }
    var uri = app.get('env') == "build" ? process.env.MONGOLAB : process.env.MONGO_URL;

    db.connect(uri, function (err) {
        if (err) console.log(err);
        callback();
    });

    db.connection.on('connected', function () {
        if (app.get('env') == 'production')
            console.log("Connected to database");
        console.log("connected");
    });
}


function closeMongoDB(callback) {
    db.connection.close(callback);
    if (app.get('env') == 'production')
        console.log("closing database");
    console.log("closed");
}



module.exports = {
    connectToMongoDB: connectToMongoDB,
    closeMongoDB: closeMongoDB
};