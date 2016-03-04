var fixture = require('../test/backendTest/fixture');
var databaseConnection = require('../server/model/connection');
var async = require('async');

(function () {

    var create = {
        one: databaseConnection.connectToMongoDB,
        two: fixture.fillAccounts,
        three: fixture.fillProducts,
        four: fixture.fillResidents,
        five: databaseConnection.closeMongoDB
    };

    var tear = {
        one: databaseConnection.connectToMongoDB,
        two: fixture.emptyAccounts,
        three: fixture.emptyProducts,
        four: fixture.emptyResidents,
        five: databaseConnection.closeMongoDB
    };

    async.series(process.argv[2] == "d" ? tear : create, function (err, data) {
        if (err) {
            console.log(err);
        }
        if(process.argv[2] == "d"){
            console.log("collections dropped");
        }else{
            console.log("Collections created");
        }
    })
})();
