var model = require('../model/models');
var deprecate = require('deprecate');


/**
 * Updates the available products for an account
 * @note: object{account_id: Number, available_products: [Number]}
 * @params: accountDT object, callback function
 * */
function updateAvailableProducts(account, callback) {
    model.Account.findOneAndUpdate({account_id: account.account_id}, {
        available_products: account.available_products
    }, {new: true}, function (err, data) {
        return callback(err, data);
    });
}


/**
 * % DEPRECATED %
 * */
function getAccountHistory(accountId, callback) {
    deprecate('getAccountHistory() is deprecated');
    model.Resident.find({
        'purchase_history.account_id': {
            $in: [accountId]
        }

    }, {'purchase_history.$': 1, first_name: 1}, function (err, data) {
        if (err) return callback(err);
        if (data == null) return callback();
        return callback(undefined, data);
    });
}

module.exports = {
    getAccountHistory: getAccountHistory,
    updateAvailableProducts: updateAvailableProducts
};
