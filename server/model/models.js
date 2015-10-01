var db = require('mongoose');


var purchaseSchema = new db.Schema({
    purchase_items: [String],
    total_price: Number,
    items_count: Number,
    timestamp: {type: Date, default: Date.now()}
});

var balanceHistorySchema = new db.Schema({
    balance_before: Number,
    insert_amount: Number,
    timestamp: {type: Date, default: Date.now()}
});

var resident = new db.Schema({
    resident_id: {type: Number, unique: true, required: true},
    first_name: String,
    last_name: String,
    room_number: Number,
    kitchen_number: Number,
    current_balance: Number,
    deposit: Number,                // The deposited amount when you open an account
    active: Boolean,                 // Does the resident still live here - move resident to history
    purchase_history: [purchaseSchema],
    balance_history: [balanceHistorySchema]

});


var sequence = new db.Schema({
    _id: String,
    resident_sequence_value: {type: Number, Default: 100}
});

// exposes findAndModify to the collection - atomic autoincrement added
sequence.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};


var Resident = db.model('residents', resident);
var Sequence = db.model('sequence', sequence);


module.exports = {
    Resident: Resident,
    Sequence: Sequence
};