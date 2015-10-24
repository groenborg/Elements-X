var model = require('../model/models.js');

var residentPurchaseTransaction = function (residentId, purchase, callback) {
    
    model.Resident.findOneAndUpdate({resident_id: residentId}, {
        $push: {purchase_history: purchase}
    }, {new: true}, function (err, data) {
        if (err) return callback(err);
        if (data == null) return callback();
        return callback(undefined, data);
    });
};


exports.residentPurchaseTransaction = residentPurchaseTransaction;