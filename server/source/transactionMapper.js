var model = require('../model/models.js');
var collectionMapper = require('../source/collectionGetMapper');


var residentPurchaseTransaction = function (residentId, purchase, callback) {

    delete purchase.resident_id;
    model.Resident.findOneAndUpdate({resident_id: residentId}, {
        $push: {purchase_history: purchase},
        $inc: {current_balance: -purchase.total_price}

    }, {new: true}, function (err, residentData) {
        if (err) return callback(err);
        if (residentData == null) return callback();

        model.Account.findOneAndUpdate({account_id: purchase.account_id}, {
            $inc: {balance: purchase.total_price}
        }, {new: true}, function (err, accountData) {
            if (err) return callback(err);
            if (accountData == null) return callback();
            return callback(undefined, residentData);
        });
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

/*
 *
 * resident_id: {type: Number, required: true},
 * assortment_id: {type: mongoose.Schema.Types.ObjectId, ref: "assortments"},
 * total_price: Number,
 * amount: Number,
 * timestamp: {type: Date, default: Date.now()}
 *
 * update {amount, total_price, resident_id, assortment_id}
 * */
var buyFromStorage = function (transactionData, callback) {

    model.Assortment.findByIdAndUpdate(transactionData.assortment_id, {$inc: {supply: -transactionData.amount}}, {new: true}, function (err, aData) {
        if (err)return callback(err);
        if (!aData)return callback();

        model.Transaction.create(transactionData, function (err, data) {
            if (err)return callback(err);
            if (!data)return callback();
            return callback(undefined, data)
        });
    });
};


var getAllTransactions = function (limit, callback) {
    model.Transaction.find().limit(limit).exec(function (err, data) {
        if (err) return callback(err);
        if (!data) return callback();
        return callback(undefined, data);
    });
};

exports.getAllTransactions = getAllTransactions;
exports.buyFromStorage = buyFromStorage;
exports.residentBalanceRefillTransaction = residentBalanceRefillTransaction;
exports.residentPurchaseTransaction = residentPurchaseTransaction;