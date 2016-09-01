var model = require('../model/models');
var mongoose = require('mongoose');


function searchDate(callback) {


    model.Resident.find().elemMatch('purchase_history', {
        timestamp: {

            $gte: "2016-07-14 11:05:44.872Z",
            $lt: "2016-07-16 11:05:44.872Z"



        }
    }).select('purchase_history').exec(function (err, data) {
        callback(err, data);



    });

}


module.exports = {
    searchDate: searchDate
};