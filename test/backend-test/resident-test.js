var mapper = require('../../server/source/residentMapper.js');
var connection = require('../../server/model/connection.js');
var fixture = require('./fixture.js');
var should = require('should');


describe('resident mapper tests', function () {


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
            mapper.getAllResidents(function (err) {
                if (err) throw err;
                done();
            });
        });

        it('should return a list', function (done) {
            mapper.getAllResidents(function (err, residents) {
                if (err) throw  err;
                residents.should.be.an.instanceof(Array);
                done();
            });
        });

        it('should have all properties', function (done) {
            mapper.getAllResidents(function (err, residents) {
                if (err) throw err;
                residents[0].should.have.properties(['resident_id', 'first_name', 'last_name', 'room', 'balance']);
                done();
            });
        });

    });

    describe('get one resident from the database', function () {

        var resident_id = 1;

        it('should return a resident without error', function (done) {
            mapper.getOneResident(resident_id, function (err, resident) {
                if (err) throw err;
                done();
            });
        });

        it('should return a resident object', function (done) {
            mapper.getOneResident(resident_id, function (err, resident) {
                if (err) throw err;
                resident.first_name.should.be.ok();
                done();
            });
        });
    });


    describe('update a resident with new information', function () {


        var resident_id = 1;
        var newName = "newName";


        it('should updated the resident with name', function (done) {
            mapper.updateResident({
                resident_id: 1,
                first_name: newName

            }, function (err, data) {
                console.log("error: " + err);
                console.log("data: " + data);

                data.first_name.should.equal(newName);

                data.balance.should.equal(100.22);
                console.log(data);
                done();
            });
        });

        it('should have the same resident_id as before', function (done) {

        });


    });


});




