var express = require('express');
var facade = require('../source/collectionGetMapper');
var security = require('../security/securityService');
var jwt = require('jsonwebtoken');
var router = express.Router();


/**
 * Authentication service
 * Authenticates a user for all admin services
 * */
router.post('/authenticate', function (request, response) {

    var requestedUser = request.body;
    facade.getOneElementFromCollection('Resident', {email: requestedUser.email}, function (err, user) {

        var password = security.generatePasswordHash(requestedUser.password);

        if (err) {
            response.statusCode = 501;
            response.send({err: "Authentication failed, error"});
            return;
        }

        if (!user) {
            response.statusCode = 401;
            response.send({err: "Authentication failed, user not found"});
            return;
        }
        
        if (user.password == password && user.access_level > 0) {
            var token = jwt.sign({
                first_name: user.first_name,
                resident_id: user.resident_id,
                email: user.email,
                access_level: user.access_level
            }, process.env.SECRETTOKENONE, {expiresIn: 60 * 66 * 24});
            response.send({token: token});
        } else {
            response.statusCode = 403;
            response.send({err: "access denied"});
        }
    });

});


module.exports = router;
