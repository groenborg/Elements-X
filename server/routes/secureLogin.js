var express = require('express');
var facade = require('../source/collectionGetMapper');
var jwt = require('jsonwebtoken');
var secrets = require('../security/tokens');

var router = express.Router();

router.post('/authenticate', function (request, response) {

    var requestedUser = request.body;
    facade.getOneElementFromCollection('Resident', {email: requestedUser.email}, function (err, user) {

        //add hashing and salting here
        if (err) {
            response.statusCode = 401;
            response.send({err: "user not found"})
        }

        if (user.password == requestedUser.password) {

            var token = jwt.sign({
                first_name: user.first_name,
                email: user.email,
                access_level: user.access_level
            }, secrets.secretTokenOne, {expiresIn: 60 * 10});
            response.send({token: token});
        }
    });

});


module.exports = router;
