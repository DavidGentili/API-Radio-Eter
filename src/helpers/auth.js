const jwt = require('jsonwebtoken');
const {privateKey} = require('../config');

const isAuthenticated = (req, res, next) => {  
    const {authorization : token} = req.headers;
    try{
        req.user = jwt.verify(token, privateKey).user;
        next();
    } catch(e){
        res.statusCode = 403;
        res.json({message: 'The user is not authenticated'});
        res.end();
    }
}

const authenticateUser = (user) => {
    return jwt.sign({user}, privateKey,{
        expiresIn: "24h"
    });
} 

module.exports = {
    isAuthenticated,
    authenticateUser,
}