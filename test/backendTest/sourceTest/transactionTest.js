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


    describe('resident Purchase test', function () {

        var residentId = 27;

        var purchase = {
            current_balance: 20,
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


    /*
     * var balanceHistorySchema = new mongoose.Schema({
     balance_before: Number,
     insert_amount: Number,
     timestamp: {type: Date, default: Date.now}
     }, {
     _id: false
     });
     *
     * */

    describe('resident Refill Balance test', function () {


        var balanceHistoryItem = {
            insert_amount: 100,


        }


    });


})
;