var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var singlePageRoute = require('./server/routes/index');
var residentRoute = require('./server/routes/residentRest');
var transactionRoute = require('./server/routes/transactions');
var assortmentRoute = require('./server/routes/assortmentService');
var serverRoute = require('./server/routes/serverMaintenanceService');


//var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
var connection = require('./server/model/connection');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// this should be changed
connection.connectToMongoDB(function (err, data) {

});

app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client/SPA')));


app.use('/', singlePageRoute);
app.use('/api', residentRoute);
app.use('/api', transactionRoute);
app.use ('/api', assortmentRoute);
app.use('/server', serverRoute);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


if (app.get('env') === 'production') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;
