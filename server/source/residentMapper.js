var model = require('../model/models.js');
var deprecate = require('deprecate');

/**
 * Retrieves all residents
 * @params: callback
 * */
function getAllResidents(callback) {
    model.Resident.find({}, function (err, residents) {
        if (err) return callback(err);
        if (residents == null) return callback();
        return callback(undefined, residents)
    });
}

/**
 * retrieves one resident
 * @params: resident id, callback function
 * */
function getOneResident(residentID, callback) {
    model.Resident.findOne({resident_id: residentID}, function (err, resident) {
        if (err) return callback(err);
        if (resident == null) return callback();
        return callback(undefined, resident);
    });
}

/**
 * Retrieves history for specified resident
 * @note: -100 makes the function return the last 100 items
 * */
function getResidentHistory(residentId, callback) {
    model.Resident.findOne({resident_id: residentId}).select({"purchase_history": {"$slice": -100}}).exec(function (err, data) {
        return callback(err, data);
    });
}


/**
 * Retrieves all residents grouped by kitchen
 * @params: callback function
 * */
var getKitchenGroups = function (callback) {
    model.Resident.aggregate(
        [
            {
                $group: {
                    _id: '$kitchen_number', residents: {
                        $push: {
                            resident_id: "$resident_id",
                            first_name: "$first_name",
                            last_name: "$last_name",
                            room_number: "$room_number",
                            kitchen_number: "$kitchen_number",
                            current_balance: "$current_balance",
                            deposit: "$deposit",
                            phone: "$phone",
                            email: "$email",
                            active: "$active",
                            access_level: "$access_level",
                            quick_buy: "$quick_buy"
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


/**
 * Update one resident
 * @note: a resident id must exist in the updatedResident parameter
 * @params: update object, callback function
 * */
function updateResident(updatedResident, callback) {
    model.Resident.findOneAndUpdate({resident_id: updatedResident.resident_id}, {
        first_name: updatedResident.first_name,
        last_name: updatedResident.last_name,
        room_number: updatedResident.room_number,
        kitchen_number: updatedResident.kitchen_number,
        current_balance: updatedResident.current_balance,
        quick_buy: updatedResident.quick_buy,
        phone: updatedResident.phone,
        email: updatedResident.email,
        access_level: updatedResident.access_level
    }, {new: true}, function (err, updatedResident) {
        return callback(err, updatedResident);
    });
}

/**
 * Delete a resident
 * @params: resident id, callback function
 **/
function deleteResident(residentID, callback) {
    model.Resident.findOneAndRemove({resident_id: residentID}, function (err, data) {
        if (err) return callback(err);
        if (data == null) return callback();
        return callback(undefined, data);
    });
}


/**
 * Creates a new resident
 * @note: users a counter which must be created by a script
 * @params: resident object, callback function
 * */
function createResident(resident, callback) {
    model.Sequence.findAndModify({_id: 'resident_counter'}, [], {$inc: {sequence_value: 100}}, {}, function (err, next) {
        if (err) return callback(err);
        if (next == null) return callback();
        resident.resident_id = next.value.sequence_value;
        model.Resident.create(resident, function (err, resident) {
            if (err) return callback(err);
            if (next == null) return callback();
            return callback(undefined, resident);
        });
    });
}


module.exports = {
    getResidentHistory: getResidentHistory,
    getAllResidents: getAllResidents,
    getOneResident: getOneResident,
    updateResident: updateResident,
    deleteResident: deleteResident,
    createResident: createResident,
    getKitchenGroups: getKitchenGroups
};
