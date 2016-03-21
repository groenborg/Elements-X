var fixture = require('../test/backendTest/fixture');
var sequence = require('../server/model/models');
var async = require('async');
var config = require('../config');


function createAccount(callback) {
    sequence.Sequence.create({_id: 'account_counter'}, function (err, data) {
        return callback();
    })
}

function createProduct(callback) {
    sequence.Sequence.create({_id: 'product_counter'}, function (err, data) {
        return callback();
    })
}

function createResident(callback) {
    sequence.Sequence.create({_id: 'resident_counter'}, function (err, data) {
        return callback();
    })
}


(function () {

    if (process.argv[3]) {
        process.env.NODE_ENV = "build";
        console.log(process.env.NODE_ENV);
    }

    var databaseConnection = require('../server/model/connection');

    var create = {
        one: databaseConnection.connectToMongoDB,
        two: fixture.fillAccounts,
        three: fixture.fillProducts,
        four: fixture.fillResidents,
        five: createResident,
        six: createAccount,
        seven: createProduct,
        eight: databaseConnection.closeMongoDB
    };

    var tear = {
        one: databaseConnection.connectToMongoDB,
        two: fixture.emptyAccounts,
        three: fixture.emptyProducts,
        four: fixture.emptyResidents,
        five: fixture.emptyStock,
        six: fixture.emptyCounters,
        seven: databaseConnection.closeMongoDB
    };


    async.series(process.argv[2] == "d" ? tear : create, function (err, data) {
        if (err) {
            console.log(err);
        }
        if (process.argv[2] == "d") {
            console.log("collections dropped");
        } else {
            console.log("Collections created");
        }
    })
})();
