var model = require('../model/models.js');
var collectionMapper = require('../source/collectionGetMapper');
var productManager = require('../source/productMapper');


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


        if(balanceRefillItem.bar === true){
            console.log("REFILL FROM BAR");
            model.Account.findOneAndUpdate({account_id: 4},{
                $inc:{balance: -balanceRefillItem.insert_amount}
            },{new: true},function (err, data) {
                updateUser();
            });
        }else {
            updateUser();
        }

        function updateUser() {
            model.Resident.findOneAndUpdate({resident_id: residentId}, {
                current_balance: newCurrentBalance,
                $push: {balance_history: newBalance}

            }, {new: true}, function (err, data) {
                if (err) return callback(err);
                if (data == null) return callback();
                return callback(undefined, data);
            });
        }
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
            if (err) return callback(error);
            model.StockPurchase.create(stockPurchaseDTO, function (er, stock) {
                for (var i = 0; i < stockPurchaseDTO.purchase.length; ++i) {
                    productManager.restockProduct({
                        product_id: stockPurchaseDTO.purchase[i].product_id,
                        amount: -stockPurchaseDTO.purchase[i].amount
                    }, function (err) {
                        if (err) return callback(err)
                    });
                }
                return callback(er, stock);
            });
        });
    });
}


function getStockPurchaseHistory(accountId, callback) {
    model.StockPurchase.find({account_id: accountId}).limit(100).exec(function (err, data) {
        return callback(err, data);
    });
}


/**
 * Get latest 10 stock purchases
 * */
function getLatestStockPurchases(callback) {
    model.StockPurchase.find().limit(10).exec(function (err, data) {
        return callback(err, data);
    });
}


module.exports = {
    getStockPurchaseHistory: getStockPurchaseHistory,
    purchaseFromStock: purchaseFromStock,
    getLatestStockPurchases: getLatestStockPurchases,
    residentBalanceRefillTransaction: residentBalanceRefillTransaction,
    residentPurchaseTransaction: residentPurchaseTransaction
};