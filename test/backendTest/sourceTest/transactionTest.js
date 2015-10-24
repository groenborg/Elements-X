var transactionMapper = require('../../../server/source/transactionMapper.js');
var connection = require('../../../server/model/connection.js');
var fixture = require('./../fixture.js');
var should = require('should');

describe('Transaction test suite', function () {


    before('starting connection', function (done) {
        connection.connectToMongoDB(done);
    });

    after('closing connection', function (done) {
        connection.closeMongoDB(done);
    });

    beforeEach('fill resident collection', function (done) {
        fixture.fillDatabase(done);
    });

    afterEach('empty resident collection', function (done) {
        fixture.emptyDataBase(done);
    });


    /*
     var purchaseSchema = new mongoose.Schema({
     purchase_items: [String],
     total_price: Number,
     items_count: Number,
     timestamp: {type: Date, default: Date.now()}

     });
     */

    describe('residentPurchase test', function () {

        var residentId = 27;

        var purchase = {
            purchase_items: ['beer', 'beer'],
            total_price: 23,
            items_count: 2,
            timestamp: Date.now()
        };

        it('purchase history should have a length of two', function (done) {
            transactionMapper.residentPurchaseTransaction(residentId, purchase, function (err, data) {
                if (err) throw err;
                data.purchase_history.length.should.equal(2);
                done();
            });
        });
    });


})
;