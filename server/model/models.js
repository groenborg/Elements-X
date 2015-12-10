var mongoose = require('mongoose');

/*
 * Purchase schema
 * Document model for a resident purchase
 * No ID - must be reinstated for cancel last purchase
 * */
var purchaseSchema = new mongoose.Schema({
    purchase_items: [String],
    total_price: Number,
    items_count: Number,
    timestamp: {type: Date, default: Date.now}
}, {
    _id: false
});

/*
 * Balance Schema
 * Document model for a balance refill
 * With ID
 * */
var balanceHistorySchema = new mongoose.Schema({
    balance_before: Number,
    insert_amount: Number,
    timestamp: {type: Date, default: Date.now}
});

/*
 * Resident schema
 * Document model for a resident in the system
 * access_level: 0 = default
 * access_level: 1 = bartender
 * access_level: 2 = admin
 * access_level: 3 = Super admin, access to logs and transactions
 * */
var resident = new mongoose.Schema({
    resident_id: {type: Number, unique: true, required: true},
    first_name: String,
    last_name: String,
    room_number: Number,
    kitchen_number: Number,
    current_balance: Number,
    deposit: Number,                            // The deposited amount when you open an account
    phone: String,
    active: Boolean,
    email: String,
    access_level: Number,                           // Does the resident still live here - move resident to history
    password: String,
    achievements: [String],
    purchase_history: [purchaseSchema],
    balance_history: [balanceHistorySchema]
});

/*
 * Assortment Schema
 * Document model for purchase items in the bar
 * Supply: amount stored in warehouse
 * item size: units in a box e.g. 24 in a beer box
 * */
var assortment = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    supply: Number,
    item_size: Number,
    description: String,
    one_price: Number,
    two_price: Number,
    three_price: Number,
    bar_price: Number
});


// not nested for security reasons - for later review
var transaction = new mongoose.Schema({
    resident_id: {type: Number, required: true},
    assortment_id: {type: mongoose.Schema.Types.ObjectId, ref: "assortments"},
    total_price: Number,
    amount: Number,
    timestamp: {type: Date, default: Date.now()}
});

//sequence for unique ID generation
var sequence = new mongoose.Schema({
    _id: String,
    resident_sequence_value: {type: Number, Default: 100}
});

// exposes findAndModify to the collection - atomic autoincrement added
sequence.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};


var Resident = mongoose.model('residents', resident);
var Sequence = mongoose.model('sequence', sequence);
var Assortment = mongoose.model('assortments', assortment);
var Transaction = mongoose.model('transactions', transaction);

module.exports = {
    Resident: Resident,
    Sequence: Sequence,
    Assortment: Assortment,
    Transaction: Transaction
};
