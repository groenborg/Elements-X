var data = require('./../test/backend-test/test-data.json');
var fs = require('fs');

function setIDAndDate() {
    var residentID = 0;

    for (var i = 0; i < data.length; ++i) {

        data[i].resident_id = residentID;
        for (var j = 0; j < data[i].purchase_history.length; ++j) {
            data[i].purchase_history[j].timestamp = new Date();
        }

        residentID++;
    }

    var json = JSON.stringify(data);
    fs.writeFile("test-data.json", json, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(data);

    })
};


