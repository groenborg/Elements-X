var db = require('mongoose');


var purchase_schema = new db.Schema({
    items: [String],
    price: Number,
    timestamp: {type: Date, default: Date.now()}
});


var person = new db.Schema({
    person_is: {type: Number, unique: true, required: true},
    first_name: String,
    last_name: String,
    room: Number,
    kitchen: Number,
    balance: Number,
    purchase_history: [purchase_schema]
});


var Person = db.model('persons', person);
var Purchase = db.model('purchase', purchase_schema);


module.exports = {
    Person: Person,
    Purchase: Purchase
};