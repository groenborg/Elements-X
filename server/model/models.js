var mongoose = require('mongoose');

/**
 * Purchase schema
 * Document model for a resident purchase
 * _id - Usage for cancel last transaction
 * */
var purchaseSchema = new mongoose.Schema({
    account_id: Number,
    purchase_items: [{
        product_id: Number,
        amount: Number
    }],
    total_price: Number,
    timestamp: {type: Date, default: Date.now}
});

/**
 * Balance Schema
 * Document model for a balance refill
 * _id - to locate faulty inserts
 * */
var balanceHistorySchema = new mongoose.Schema({
    balance_before: Number,
    insert_amount: Number,
    timestamp: {type: Date, default: Date.now}
});

/**
 * Resident schema
 * Document model for a resident in the system
 * access_level: 0 = user
 * access_level: 1 = bartender
 * access_level: 2 = admin
 * access_level: 3 = Super admin, access to logs and transactions
 * */
var resident = new mongoose.Schema({
    resident_id: {type: Number, unique: true, required: true},
    first_name: String,
    last_name: String,
    room_number: Number,
    kitchen_number: {type: Number, required: true},
    current_balance: Number,
    deposit: Number,                           // The deposited amount when you open an account
    phone: String,
    email: {type: String, unique: true},
    active: Boolean,
    access_level: Number,         // Does the resident still live here - move resident to history
    password: String,
    quick_buy: Number,
    purchase_history: [purchaseSchema],
    balance_history: [balanceHistorySchema]
});


var priceSchema = new mongoose.Schema({
    account_id: Number,
    price: Number
}, {_id: false});


/**
 * Products Schema
 * Document model for purchase items
 * in_stock: amount stored in warehouse
 *
 * */
var products = new mongoose.Schema({
    product_id: {type: Number, unique: true, required: true},
    name: {type: String, required: true},
    description: String,
    in_stock: Number,
    purchase_price: Number,
    retail_price: [priceSchema],
    box: Boolean,
    box_size: Number,
    bottle: Boolean
});

/**
 * Stock_purchase Schema
 * Document model for buying from the stock
 * resident_id to see which user made the purchase
 * */
var stock_purchase = new mongoose.Schema({
    resident_id: {type: Number, required: true},
    product_id: {type: Number}, // references product.product_id
    total_price: Number,
    amount: Number,
    timestamp: {type: Date, default: Date.now}
});

/**
 * Account Schema
 * Document model for the kitchens, bar and CBS
 * balance: amount of money from the kitchens
 *
 * user_visible - accounts with attached user (kitchen_number) must be user visible
 * */
var account = new mongoose.Schema({
    account_id: Number,
    account_name: {type: String, required: true},
    balance: Number,
    user_visible: Boolean,
    available_products: [Number], //references products.product_id
    stock_purchase: [stock_purchase]
});


/**
 * Account Sequence
 * Generating unique id for Accounts
 * */
var sequence = new mongoose.Schema({
    _id: String,
    sequence_value: {type: Number, default: 100}
});


/**
 * exposes findAndModify to the collection - atomic autoincrement added
 * */
sequence.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

///////////////////////////////////////////////////////////////////////////////////

var Account = mongoose.model('accounts', account);
var Resident = mongoose.model('residents', resident);
var Sequence = mongoose.model('sequence', sequence);
var Product = mongoose.model('products', products);

module.exports = {
    Resident: Resident,
    Product: Product,
    Account: Account,
    Sequence: Sequence
};
