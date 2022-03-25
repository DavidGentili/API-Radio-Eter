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

const getFormatUser = (objectUser) => {
    const keys = ['name', 'email', 'securityLevel', 'createdAt']
    const user = {};
    user.id = objectUser.id;
    keys.forEach(key => user[key] = objectUser[key]);
    return {user};
}

const authenticateUser = (objectUser) => {
    return jwt.sign(getFormatUser(objectUser), privateKey,{
        expiresIn: "24h"
    });
} 

module.exports = {
    isAuthenticated,
    authenticateUser,
}