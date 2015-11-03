var model = require('../model/models.js');

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


var residentBalanceRefillTransaction = function (residentId, balance, callback) {


    model.Resident.findOneAndUpdate({resident_id: residentId}, {

        $push: {balance_history: balance}
    }, {new: true}, function (err, data) {
        if (err) return callback(err);
        if (data == null) return callback();
        return callback(undefined, data);
    });
};


exports.residentBalanceRefillTransaction = residentBalanceRefillTransaction;
exports.residentPurchaseTransaction = residentPurchaseTransaction;