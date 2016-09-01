var analytic = require('../../../server/source/analyticsMapper.js');
var connection = require('../../../server/model/connection.js');
var should = require('should');
var util = require('util');


describe('analytics test', function () {

    before(function (done) {
        connection.connectToMongoDB(function () {
            done();
        })
    });


    after(function (done) {
        connection.closeMongoDB(function () {
            done();
        })
    });

    describe('find date ', function () {

        it('should return something', function (done) {

            analytic.searchDate(function (err, data) {
                console.log(util.inspect(data,false,null));
                console.log(err);
            });


            done();
        });
    });


});