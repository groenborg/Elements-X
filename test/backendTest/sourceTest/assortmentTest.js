var assortmentMapper = require('../../../server/source/assortmentMapper.js');
var connection = require('../../../server/model/connection.js');
var fixture = require('./../fixture.js');
var should = require('should');


describe("Assortment test suite", function () {


    //Create connection to database
    before(function (done) {
        connection.connectToMongoDB(done);
    });

    //Close connection to database
    after(function (done) {
        connection.closeMongoDB(done);
    });

    //Fill database before each test
    beforeEach(function (done) {
        fixture.fillAssortment(done);
    });


    //Empty database before each test
    afterEach(function (done) {
        fixture.emptyAssortment(done);
    });


    describe("Create Assortment tests", function () {

        var item = {
            name: "New Item",
            supply: 345,
            price: 4.45,
            description: "A  drink"
        };


        it('Should create a new assortment item', function (done) {

            assortmentMapper.createAssortment(item, function (err, data) {
                if (err) {
                    throw new Error();
                }
                data.name.should.equal(item.name);
                data.price.should.equal(item.price);
                done();
            });

        });


        it('Should not create assortment with same name', function (done) {

            // duplicate name
            item.name = "Tuborg Guld";

            assortmentMapper.createAssortment(item, function (err, data) {
                if (err) {
                    done();
                }
            });

        });

    });


    describe('Update Assortment tests', function () {


        it('should update and return updated object', function (done) {

            done();
        });


    });

});