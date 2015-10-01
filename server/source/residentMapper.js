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
        room_number: updatedResident.room_number,
        kitchen_number: updatedResident.kitchen_number,
        current_balance: updatedResident.current_balance

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


// a special counter is created by a script for this to work
var createResident = function (resident, callback) {
    model.Sequence.findAndModify({_id: 'counter'}, [], {$inc: {resident_sequence_value: 1}}, {}, function (err, next) {

        if (err) return callback(err);
        if (next == null) return callback();

        // no error in returning the next value from the sequence
        resident.resident_id = next.value.resident_sequence_value;
        model.Resident.create(resident, function (err, resident) {
            if (err) return callback(err);
            if (next == null) return callback();
            return callback(undefined, resident);
        });
    });
};


module.exports = {

    getAllResidents: getAllResidents,
    getOneResident: getOneResident,
    updateResident: updateResident,
    deleteResident: deleteResident,
    createResident: createResident

};