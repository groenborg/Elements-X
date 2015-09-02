var mapper = require('../../server/source/residentMapper.js');
var connection = require('../../server/model/connection.js');
var should = require('should');

describe('resident mapper tests', function () {


    before(function (done) {
        connection.connectToMongoDB(done);
    });


    after(function (done) {
        connection.closeMongoDB(done);
    });


    describe('get all residents from database', function () {

        it('should return without error', function (done) {
            mapper.getAllResidents(function (err) {
                if (err) throw err;
                done();
            })
        });

        it('should return a list', function (done) {
            mapper.getAllResidents(function (err, residents) {
                if (err) throw  err;
                residents.should.be.an.instanceof(Array);
                done();
            })
        });

        it('should have all properties', function (done) {
            mapper.getAllResidents(function (err, residents) {
                if (err) throw err;
                residents[0].should.have.properties(['resident_id', 'first_name', 'last_name', 'room', 'balance']);
                done();
            })
        })


    })


});




