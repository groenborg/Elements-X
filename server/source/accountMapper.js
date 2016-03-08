var model = require('../model/models');

var getAccountHistory = function (callback) {
    model.Resident.aggregate(
        [
            {
                $group: {
                    _id: '$purchase_history.account_id', accounts: {
                        $push: {
                            total_price: "$total_price"
                        }
                    }
                }
            }
        ], function (err, data) {
            if (err) return callback(err);
            if (data == null) return callback();
            return callback(undefined, data);
        });
};

module.exports = {
    getAccountHistory: getAccountHistory
};
