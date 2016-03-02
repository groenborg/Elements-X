var transactionMapper = require('../../../server/source/transactionMapper.js');
var residentMapper = require('../../../server/source/residentMapper');
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

    beforeEach('fill resident collection', function () {
        //fixture.fillDatabase(done);
    });

    afterEach('empty resident collection', function () {
        //fixture.emptyDataBase(done);
    });

    xdescribe('resident Purchase test', function () {

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
                console.log(data);
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
    xdescribe('resident Refill Balance test', function () {

        var storageTransaction = {
            resident_id: 14,
            amount: 2,
            total_price: 100,
            assortment_id: "56964e75595474566e778b9f"
        };

        it('should get all assortment items', function (done) {
            collectionMapper.getAllElementsFromCollection("Assortment", function (err, data) {
                if (data) {
                    done();
                }
            });
        });


        it('should create transaction', function (done) {
            transactionMapper.buyFromStorage(storageTransaction, function (err, data) {
                data.resident_id.should.equal(storageTransaction.resident_id);
                done();
            });

        });


    });


    describe('find with date', function () {


        it('should return history', function (done) {

            residentMapper.findTenDayPurchase(function (err, data) {
                console.log(err);
                console.log(data);


            });


        });

    });

});
