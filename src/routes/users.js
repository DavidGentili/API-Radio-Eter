const router = require('express').Router();
const { isAuthenticated, authenticateUser } = require('../helpers/auth');
const User = require('../models/User');
const { checkUserData } = require('../helpers/checkData');
const generator = require('generate-password');
const { notifyNewUser } = require('../helpers/sendMail');

const signupUser = async (req) => {
    const {email, name, securityLevel} = req.body;
    const check = checkUserData({email,name,securityLevel}) 
    if(check !== true) // se constata que la informacion sea correcta
        throw {code: 400, response: {message: `incorrect ${check}`}};

    const currentEmail = await User.findOne({email: email.toLowerCase()}) 
    if(currentEmail)// se constata que no este repetido el mail
        throw {code: 400, response: {message: 'The mail that you are trying to register is already registered'}};

    const password = generator.generate({length: 10, numbers: true}); //Se genera una contraseña aleatoria al nuevo usuario
    const newUser = new User({email, name, password, securityLevel});
    await newUser.save();
    notifyNewUser({email, name, password}); // Se notifica al nuevo usuario la creacion de la cuenta
    return {message: 'User created successfully'};
    
    
        
} 

const loginUser = async (req) => {
    const {email, password} = req.body;
    const currentUser = await User.findOne({email: email.toLowerCase()});
    if(!currentUser)
        throw {code: 400 , response: {message: 'wrong user/password'}}
    const matchPassword = await currentUser.matchPassword(password);
    if(matchPassword)
        return {token: authenticateUser(currentUser)};
    else
        throw {code: 400, response: {message: 'wrong user/password'}};
    
        
}

const changePassword = async ({currentPassword, newPassword, id}) => {
    const currentUser = await User.findById(id);
    const matchPassword = await currentUser.matchPassword(currentPassword);
    if(!currentUser || !matchPassword )
        throw {code: 403, response: {message: 'authorization error'}}
    const hashPassword = await currentUser.hashPassword(newPassword)
    await User.findOneAndUpdate({id}, {password: hashPassword});
    return {message: 'the password was changed successful'}
}

router.post('/users/signup', isAuthenticated, (req,res) => {
    const {user} = req;
    if(user.securityLevel.toLowerCase() !== 'master'){
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

router.put('/users/password', isAuthenticated, (req,res) => {
    const {currentPassword, newPassword} = req.body;
    const {id} = req.user;
    changePassword({currentPassword, newPassword, id})
    .then((response) => {
        res.status = 200;
        res.json(response);
    })
    .catch((e) => {
        const {code = 500, response = {message: 'Internal Server Error'}} = e;
        res.statusCode = code;
        res.json(response)
    })
})

module.exports = router;