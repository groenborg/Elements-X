/**
 * Created by Simon on 21/03/2016.
 */

var crypto = require('crypto');
var secureConfig = require('../../config').security;


function generatePasswordHash(password) {
    return crypto.createHmac('sha256', secureConfig.secretHashKey).update(password + secureConfig.salt).digest('base64');
}


module.exports = {
    generatePasswordHash: generatePasswordHash
};