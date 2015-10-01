var assortmentMapper = require("../../server/source/assortmentMapper.js");
var connection = require('../../server/model/connection.js');
var should = require('should');


describe('assortment mapper test', function () {


    before(function (done) {
        connection.connectToMongoDB(done);
    });

    after(function (done) {
        connection.closeMongoDB(done);
    });

    describe('test universal getAll function', function () {


        it('should return something', function () {

            var collection = "Resident";

            assortmentMapper.getAllElementsFromCollection(collection, function (err, data) {
                console.log(data);
            });


        });

    });


});
