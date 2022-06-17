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

const correctSecurityLevel = (req, res, next) => {
    const { user } = req;
    const { securityLevelRequired } = req;
    if(!securityLevelRequired.includes(user.securityLevel)){
        res.statusCode = 403;
        res.json({message: 'the user doesn´t have the security level required to complete this action'});
    } else
        next();   
}

module.exports = {
    isAuthenticated,
    correctSecurityLevel,
}