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
    deposit: Number,                            // The deposited amount when you open an account
    active: Boolean,                            // Does the resident still live here - move resident to history
    purchase_history: [purchaseSchema],
    balance_history: [balanceHistorySchema]

});


var assortment = new db.Schema({
    name: {type: String, unique: true, required: true},
    supply: Number,
    price: Number,
    description: String

});


// not nested for security reasons - for later review
var transaction = new db.Schema({
    resident_id: {type: Number, required: true},
    assortment_id: String,//{type: Schema.Types.ObjectId, ref: assortment},
    total_price: Number,
    amount: Number,
    timestamp: {type: Date, default: Date.now()}

});

//sequence for unique ID generation
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
var Assortment = db.model('assortment', assortment);
var Transaction = db.model('transactions', transaction);

module.exports = {
    Resident: Resident,
    Sequence: Sequence,
    Assortment: Assortment,
    Transaction: Transaction
};