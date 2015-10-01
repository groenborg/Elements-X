var con = require('../server/model/connection');
var sequence = require('../server/model/models');

function createSequence() {
    con.connectToMongoDB(function (err, data) {
        if (err) {
            con.closeMongoDB();
            console.log("HEllo");
            throw err;
        }
        console.log(data);

        sequence.Sequence.create({_id: 'counter', resident_sequence_value: 100}, function (err, data) {
            if (err) throw err;
            console.log(data);
            con.closeMongoDB();
        });
    });
}



function autoIncrement() {

    con.connectToMongoDB(function (err, data) {
        if (err) {
            con.closeMongoDB();
            console.log("HEllo");
            throw err;
        }
        console.log(data);

        sequence.Sequence.findAndModify({_id: 'counter'}, [], {$inc: {resident_sequence_value: 1}}, {}, function (err, data) {
            if (err) throw err;
            console.log(data);
            con.closeMongoDB()
        });


    });

}