const crypto = require('crypto');

function generateRandomCode(length = 10) {
    return crypto.randomBytes(length / 2).toString('hex');
}

module.exports = {
    generateRandomCode
}