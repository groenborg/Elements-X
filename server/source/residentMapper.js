var model = require('../model/models.js');

var getAllResidents = function (callback) {
    model.Resident.find({}, function (err, residents) {

        if (err) return callback(err);
        if (residents == null) return callback();
        return callback(undefined, residents)

    });
};

var getOneResident = function (residentID, callback) {
    model.Resident.findOne({resident_id: residentID}, function (err, resident) {

        if (err) return callback(err);
        if (resident == null) return callback();
        return callback(undefined, resident);
    })
};

/* findOneAndUpdate({query},{update},callback);*/
var updateResident = function (updatedResident, callback) {

    model.Resident.findOneAndUpdate({resident_id: updatedResident.resident_id}, {

        first_name: updatedResident.first_name,
        last_name: updatedResident.last_name,
        room: updatedResident.room,
        kitchen: updatedResident.kitchen,
        balance: updatedResident.balance

        /* {new: true} - return the updated object instead of the old one*/
    }, {new: true}, function (err, returnUpdatedResident) {

        if (err) return callback(err);
        if (returnUpdatedResident == null) return callback();
        return callback(undefined, returnUpdatedResident);

    });

};

var deleteResident = function (residentID, callback) {
    model.Resident.findOneAndRemove({resident_id: residentID}, function (err, data) {

        if (err) return callback(err);
        if (data == null) return callback();
        return callback(undefined, data);

    });
};


var createResident = function () {

};


module.exports = {

    getAllResidents: getAllResidents,
    getOneResident: getOneResident,
    updateResident: updateResident,
    deleteResident: deleteResident,
    createResident: createResident


};