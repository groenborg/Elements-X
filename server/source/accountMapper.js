var model = require('../model/models');
var deprecate = require('deprecate');

/**
 * % DEPRECATED %
 *
 * */

var getAccountHistory = function (accountId, callback) {
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
};

module.exports = {
    getAccountHistory: getAccountHistory
};
