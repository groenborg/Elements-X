var con = require('../server/model/connection');
var config = require('../config');
var sequence = require('../server/model/models');
var async = require('async');


function createSequence() {

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
        async.series({
            one: con.connectToMongoDB,
            two: createAccount,
            three: createProduct,
            four: createResident,
            five: con.closeMongoDB
        }, function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("setup done");
        })
    })();
}

createSequence();


function autoIncrement() {

    con.connectToMongoDB(function (err, data) {
        if (err) {
            con.closeMongoDB();
            console.log("HEllo");
            throw err;
        }
        console.log(data);

        sequence.Sequence.findAndModify({_id: 'product_counter'}, [], {$inc: {sequence_value: 1}}, {}, function (err, data) {
            if (err) throw err;
            console.log(data);
            con.closeMongoDB()
        });


    });
}
//autoIncrement();