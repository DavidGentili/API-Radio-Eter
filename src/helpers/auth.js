const jwt = require('jsonwebtoken');
const { formatObjectResponse } = require('./formatData');
const {privateKey} = require('../config');

const authenticateUser = (objectUser) => {
    const user = formatObjectResponse(objectUser);
    return jwt.sign({user}, privateKey,{
        expiresIn: "24h"
    });
} 

module.exports = {
    isAuthenticated,
    authenticateUser,
}