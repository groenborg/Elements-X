var request = require('supertest');
var connection = require('../../../server/model/connection.js');
var should = require('should');
var fixture = require('./../fixture.js');
var express = require('express');

var app = express();


xdescribe('resident webservice test', function () {


    before(function (done) {
        connection.connectToMongoDB(function () {
            fixture.fillDatabase(done);
        });
    });

    after(function (done) {
        fixture.emptyDataBase(function () {
            connection.closeMongoDB(done);
        });
    });


    xdescribe('get all residents test', function () {

        it('should return all residents', function (done) {

            request(app)
                .get('api/getResidents')
                .expect(200)
                .expect('Content-type', /json/)
                .end(function (err, res) {
                    console.log("HELLOSOOS");
                    if(err) throw err;
                    res.length.should.be.above(5);
                    done();
                });
        });
    });

});