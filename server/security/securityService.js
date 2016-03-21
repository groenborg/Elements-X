/**
 * Created by Simon on 21/03/2016.
 */
var crypto = require('crypto');

function generatePasswordHash(password) {
    var secretHashKey = process.env.SECRETHASHKEY;
    var salt = process.env.SALT;
    return crypto.createHmac('sha256', secretHashKey).update(password + salt).digest('base64');
}


module.exports = {
    generatePasswordHash: generatePasswordHash
};