var model = require('../model/models.js');

var getAllResidents = function (callback) {
    model.Resident.find({}, function (err, residents) {
        if (err) return callback(err);
        if (residents == null) return callback();
        return callback(undefined, residents)
    })
};


module.exports = {

    getAllResidents: getAllResidents

};