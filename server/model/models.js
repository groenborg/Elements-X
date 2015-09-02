var db = require('mongoose');


var purchase_schema = new db.Schema({
    items: [String],
    price: Number,
    timestamp: {type: Date, default: Date.now()}
});


var resident = new db.Schema({
    resident_id: {type: Number, unique: true, required: true},
    first_name: String,
    last_name: String,
    room: Number,
    kitchen: Number,
    balance: Number,
    purchase_history: [purchase_schema]
});


var Resident = db.model('residents', resident);
var Purchase = db.model('purchase', purchase_schema);


module.exports = {
    Resident: Resident,
    Purchase: Purchase
};