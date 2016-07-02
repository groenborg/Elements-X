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
 * Withdraws or subtracts from the CBS account
 * @note: CBS has account_id: ( 5 )
 * @params: amount object {amount: Number}, callback function
 * */
function withdrawFromCBS(dto, callback) {
    model.Account.findOneAndUpdate({account_id: dto.account_id}, {
        $inc: {balance: dto.amount}
    }, {new: true}, function (err, data) {
        return callback(err, data);
    });
}

module.exports = {
    withdrawFromCBS: withdrawFromCBS,
    updateAvailableProducts: updateAvailableProducts
};
