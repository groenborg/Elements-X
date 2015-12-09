var model = require('../model/models.js');
var collectionMapper = require('../source/collectionGetMapper');


var residentPurchaseTransaction = function (residentId, purchase, callback) {

    var balance = purchase.current_balance;
    delete purchase.resident_id;
    delete purchase.current_balance;


    model.Resident.findOneAndUpdate({resident_id: residentId}, {
        current_balance: balance,
        $push: {purchase_history: purchase}
    }, {new: true}, function (err, data) {
        if (err) return callback(err);
        if (data == null) return callback();
        return callback(undefined, data);
    });
};




var residentBalanceRefillTransaction = function (residentId, balanceRefillItem, callback) {

    collectionMapper.getOneElementFromCollection('Resident', {resident_id: residentId}, function (err, data) {
        if (err) return callback(err);
        if (!data.current_balance) return callback();

        var newCurrentBalance = data.current_balance + balanceRefillItem.insert_amount;
        var newBalance = {
            balance_before: data.current_balance,
            insert_amount: balanceRefillItem.insert_amount,
            timestamp: Date.now()
        };

        model.Resident.findOneAndUpdate({resident_id: residentId}, {
            current_balance: newCurrentBalance,
            $push: {balance_history: newBalance}

        }, {new: true}, function (err, data) {
            if (err) return callback(err);
            if (data == null) return callback();
            return callback(undefined, data);
        });
    });
};


exports.residentBalanceRefillTransaction = residentBalanceRefillTransaction;
exports.residentPurchaseTransaction = residentPurchaseTransaction;