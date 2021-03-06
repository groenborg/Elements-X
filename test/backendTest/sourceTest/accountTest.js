var accountMapper = require('../../../server/source/accountMapper');
var connection = require('../../../server/model/connection.js');
var fixture = require('./../fixture.js');
var should = require('should');
var util = require('util');

describe('Account test suite', function () {


    before('starting connection', function (done) {
        connection.connectToMongoDB(done);
    });

    after('closing connection', function (done) {
        connection.closeMongoDB(done);
    });

    beforeEach('fill resident collection', function () {
        //fixture.fillDatabase(done);
    });

    afterEach('empty resident collection', function () {
        //fixture.emptyDataBase(done);
    });

    xdescribe('Account History Test', function () {


        it('return account history from users', function (done) {
            accountMapper.getAccountHistory(1,function (err, data) {
                if (err) {
                    throw err;
                } else {

                    console.log(util.inspect(data, false, null));
                    done();

                }

            });
        });

    });


});
