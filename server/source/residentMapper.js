var model = require('../model/models.js');

var getAllResidents = function (callback) {
    model.Resident.find({}, function (err, residents) {
        if (err) return callback(err);
        if (residents == null) return callback();
        return callback(undefined, residents)
    })
};

var getOneResident = function (resident_id, callback) {
    model.Resident.findOne({resident_id: resident_id}, function (err, resident) {
        if (err) return callback(err);
        if (resident == null) return callback();
        return callback(undefined, resident);
    })
};

// findOneAndUpdate({query},{update},callback);
var updateResident = function (updatedResident, callback) {
    model.Resident.findOneAndUpdate({resident_id: updatedResident.resident_id}, {
        first_name: updatedResident.first_name
    }, {new: true}, function (err, returnUpdatedResident) {
        if (err) return callback(err);
        if (returnUpdatedResident == null) return callback();
        return callback(undefined, returnUpdatedResident);
    });
};


module.exports = {

    getAllResidents: getAllResidents,
    getOneResident: getOneResident,
    updateResident: updateResident

};