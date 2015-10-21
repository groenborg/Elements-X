var fixture = require('../test/backendTest/fixture');
var databaseConnection = require('../server/model/connection');
var async = require('async');

(function () {
    async.series({
        one: databaseConnection.connectToMongoDB,
        two: fixture.fillDatabase,
        three: fixture.fillAssortment,
        four: databaseConnection.closeMongoDB
    }, function (err, data) {
        if (err) {
            console.log(err);
        }
        console.log("setup done");
    })

})();
