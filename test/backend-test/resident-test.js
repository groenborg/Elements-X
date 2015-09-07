var residentMapper = require('../../server/source/residentMapper.js');
var connection = require('../../server/model/connection.js');
var fixture = require('./fixture.js');
var should = require('should');


describe('resident residentMapper tests', function () {


    /* CONNECT TO DATABASE*/
    before('starting connection', function (done) {
        connection.connectToMongoDB(done);
    });

    after('closing connection', function (done) {
        connection.closeMongoDB(done);
    });


    /*FILL THE DOCUMENT STORE*/
    beforeEach('fill resident collection', function (done) {
        fixture.fillDatabase(done);
    });

    afterEach('empty resident collection', function (done) {
        fixture.emptyDataBase(done);
    });


    /*TEST CASES*/

    describe('get all residents from database', function () {

        it('should return without error', function (done) {
            residentMapper.getAllResidents(function (err) {
                if (err) throw err;
                done();
            });
        });

        it('should return a list', function (done) {
            residentMapper.getAllResidents(function (err, residents) {
                if (err) throw  err;
                residents.should.be.an.instanceof(Array);
                done();
            });
        });

        it('should have all properties', function (done) {
            residentMapper.getAllResidents(function (err, residents) {
                if (err) throw err;
                residents[0].should.have.properties(['resident_id', 'first_name', 'last_name', 'room', 'balance']);
                done();
            });
        });

    });

    describe('get one resident from the database', function () {

        var residentID = 1;

        it('should return a resident without error', function (done) {
            residentMapper.getOneResident(residentID, function (err, resident) {
                if (err) throw err;
                done();
            });
        });

        it('should return a resident object', function (done) {
            residentMapper.getOneResident(residentID, function (err, resident) {
                if (err) throw err;
                resident.first_name.should.be.ok();
                done();
            });
        });
    });


    describe('update a resident with new information', function () {

        var updateObject = {
            resident_id: 1,
            first_name: "UiKksdjsDJ",
            last_name: "jdujHD",
            room: 2021,
            kitchen: 2,
            balance: 1.345
        };


        it('should updated the resident with name', function (done) {
            residentMapper.updateResident(updateObject, function (err, data) {
                if (err) throw err;
                data.first_name.should.equal(updateObject.first_name);
                data.last_name.should.equal(updateObject.last_name);
                data.room.should.equal(updateObject.room);
                data.kitchen.should.equal(updateObject.kitchen);
                data.balance.should.equal(updateObject.balance);
                done();
            });
        });

        it('should have the same resident_id as before', function (done) {
            residentMapper.updateResident(updateObject, function (err, data) {
                if (err) throw err;
                data.resident_id.should.equal(updateObject.resident_id);
                done();
            });
        });


    });

    describe('delete a resident from the database', function () {

        var residentID = 1;

        it('should be deleted without error', function (done) {
            residentMapper.deleteResident(residentID, function (err, data) {
                if (err) {
                    throw err;
                }
                done();
            });
        });

    });


});



