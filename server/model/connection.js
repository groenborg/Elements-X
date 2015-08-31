var db = require('mongoose');
var uri = "mongodb://localhost/data/testdb";
var url = "mongodb://localhost:27017/test";
var model = require('./models.js');


db.connect(uri, function (err) {
    if (err) console.log(err);
});


db.connection.on('connected', function (data) {
    console.log(data + "this is awesome");
    console.log("hello wolrd");
    insertPerson();

});


var person = {
    person_is: 1,
    first_name: 'test',
    last_name: 'test_last',
    room: 3032,
    kitchen: 3,
    balance: 100.00
};

function insertPerson() {
    model.Person.create(person, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(data);

    })


}