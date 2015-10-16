var collectionGetMapper = require("../../../server/source/collectionGetMapper.js");
var connection = require('../../../server/model/connection.js');
var fixture = require('./../fixture.js');
var should = require('should');


describe('CollectionGetMapper test suite', function () {

    before(function (done) {
        connection.connectToMongoDB(function () {
            fixture.fillDatabase(function () {
                fixture.fillAssortment(done);
            });
        });
    });

    after(function (done) {
        fixture.emptyDataBase(function () {
            fixture.emptyAssortment(function () {
                connection.closeMongoDB(done);
            });
        });
    });

    describe('test universal getAll function', function () {

        var Resident = "Resident";
        var Transaction = "Transaction";
        var Assortment = "Assortment";
        var invalidCollection = "jfdksjf";

        it('should return without error', function (done) {
            collectionGetMapper.getAllElementsFromCollection(Resident, function (err, data) {
                if (err) throw err;
                done();
            });
        });

        it('should throw error 1', function (done) {
            collectionGetMapper.getAllElementsFromCollection(invalidCollection, function (err, data) {
                if (err) {
                    done();
                } else {
                    throw err;
                }

            });
        });

        it('should retrieve all residents', function (done) {
            collectionGetMapper.getAllElementsFromCollection(Resident, function (err, data) {
                if (err) throw err;

                (data[0].resident_id !== undefined).should.equal(true);
                done();
            });
        });

        it('should retrieve one residents without error', function (done) {
            collectionGetMapper.getAllElementsFromCollection(Assortment, function (err, data) {
                if (err) throw err;

                done();
            });
        });


        it('should retrieve all assortments items', function (done) {
            collectionGetMapper.getAllElementsFromCollection(Assortment, function (err, data) {
                if (err) throw err;

                (data[0].name !== undefined).should.equal(true);
                done();
            });
        });


    });


    describe('test collectionGetOne method', function () {

        it('should return one object from resident collection', function (done) {

            var collectionName = "Resident";
            var residentID = 7;

            collectionGetMapper.getOneElementFromCollection(collectionName, {resident_id: residentID}, function (err, data) {
                if (err) throw err;
                data.resident_id.should.equal(residentID);
                data.first_name.should.equal("fdg");
                done();
            });
        });


        it('should return one object from assortment collection', function (done) {

            var collectionName = "Assortment";
            var name = "Tuborg Guld";

            collectionGetMapper.getOneElementFromCollection(collectionName, {name: name}, function (err, data) {
                if (err) throw err;
                data.name.should.equal(name);
                done();
            });
        });


    });

});
