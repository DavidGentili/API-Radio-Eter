const jwt = require('jsonwebtoken');
const privateKey = 'qzZA^Eizx820';

const isAuthenticated = (req, res, next) => {  
    const {authorization : token} = req.headers;
    try{
        req.user = jwt.verify(token, privateKey).user;
    } catch(e){

    }
    next();
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