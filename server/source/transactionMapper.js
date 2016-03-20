var model = require('../model/models.js');
var collectionMapper = require('../source/collectionGetMapper');


/**
 * Purchase made by a resident
 * adds money to an associated account, and subtract it from the resident
 * */
function residentPurchaseTransaction(residentId, purchase, callback) {
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
}

/**
 * Refill a balance from a specific resident
 * @params: resident id, a refill object, callback function
 * */
function residentBalanceRefillTransaction(residentId, balanceRefillItem, callback) {
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
}

/**
 * Purchase boxes from stock
 * @note: price will be added to CBS with account_id: ( 5 )
 * @params: purchase DTO, callback function
 * */
function purchaseFromStock(stockPurchaseDTO, callback) {
    model.Account.findOneAndUpdate({account_id: stockPurchaseDTO.account_id}, {
        $inc: {balance: -stockPurchaseDTO.total_price}
    }, {new: true}, function (err, data) {
        if (err) return callback(err);
        model.Account.findOneAndUpdate({account_id: 5}, {
            $inc: {balance: stockPurchaseDTO.total_price}
        }, {new: true}, function (error, data) {
            return callback(error, data);
        });
    });
}


/**
 * DEPRECATED - must remove
 * */
var getAllTransactions = function (limit, callback) {
    model.Transaction.find().limit(limit).exec(function (err, data) {
        if (err) return callback(err);
        if (!data) return callback();
        return callback(undefined, data);
    });
};


module.exports = {
    purchaseFromStock: purchaseFromStock,
    getAllTransactions: getAllTransactions,
    residentBalanceRefillTransaction: residentBalanceRefillTransaction,
    residentPurchaseTransaction: residentPurchaseTransaction
};