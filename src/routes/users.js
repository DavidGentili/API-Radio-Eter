const router = require('express').Router();
const { isAuthenticated, authenticateUser } = require('../helpers/auth');
const User = require('../models/User');
const { checkUserData } = require('../helpers/checkData');

const signupUser = async (req) => {
    const {email, name, password, securityLevel} = req.body;
    const check = checkUserData({email,name,password,securityLevel})
    if(check === true){
        const currentEmail = await User.findOne({email: email.toLowerCase()})
        if(currentEmail)
            throw {code: 400, response: {message: 'The mail that you are trying to register is already registered'}};
        else{
            const newUser = new User({email, name, password, securityLevel})
            await newUser.save();
            return {message: 'User created successfully'};
        }
    } else
        throw {code: 400, response: {message: `incorrect ${check}`}};
} 

const loginUser = async (req) => {
    const {email, password} = req.body;
    const currentUser = await User.findOne({email: email.toLowerCase()});
    if(currentUser){
        const matchPassword = await currentUser.matchPassword(password);
        if(matchPassword)
            return {token: authenticateUser(currentUser)};
        else
            throw {code: 400, response: {message: 'wrong password'}};
    } else
        throw {code: 400 , response: {message: 'the email is not registered'}}
}

router.post('/users/signup', isAuthenticated, (req,res) => {
    const {user} = req;
    if(!user || user.securityLevel.toLowerCase() !== 'master'){
        res.statusCode = 403;
        res.json({message: 'the user not has the security level authorizated'})
    } else{
        signupUser(req)
        .then((response) => {
            res.json(response)
        })
        .catch((e) => {
            const {code = 500, response = {message: 'Internal Server Error'}} = e;
            res.statusCode = code;
            res.json(response)
        })
    }
    
})

router.post('/users/login', (req,res) => {
    loginUser(req)
    .then((response) => {
        res.json(response)
    })
    .catch((e) => {
        const {code = 500, response = {message: 'Internal Server Error'}} = e;
        res.statusCode = code;
        res.json(response)
    })
})

module.exports = router;