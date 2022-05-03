const router = require('express').Router();
const { isAuthenticated, authenticateUser } = require('../helpers/auth');
const User = require('../models/User');
const { checkUserData } = require('../helpers/checkData');
const generator = require('generate-password');
const { notifyNewUser, notifyChangePassword } = require('../helpers/sendMail');
const { formatObjectResponse, getFormatParameters } = require('../helpers/formatData');
const { securityLevels, correctSecurityLevel } = require('../helpers/securityLvl');
const responseCodeError = require('../helpers/responseCodeError');

router.use('/users',(req, res, next) => {
    req.securityLevelRequired = ['master'];
    next();
})


const signupUser = async (req) => {
    const {email, name, securityLevel} = req.body;
    const check = checkUserData({email,name,securityLevel}) 
    if(check !== true) // se constata que la informacion sea correcta
        throw {code: 400, response: {message: `incorrect ${check}`}};

    const currentEmail = await User.findOne({email: email.toLowerCase()}) 
    if(currentEmail)// se constata que no este repetido el mail
        throw {code: 400, response: {message: 'The mail that you are trying to register is already registered'}};

    const password = generator.generate({length: 10, numbers: true}); //Se genera una contraseña aleatoria al nuevo usuario
    const newUser = new User({email : email.toLowerCase(), name, password, securityLevel : securityLevel ? securityLevel.toLowerCase() : 'editor'});
    await newUser.save();
    notifyNewUser({email, name, password}); // Se notifica al nuevo usuario la creacion de la cuenta
    return {message: 'User created successfully'};  
} 

const loginUser = async (req) => {
    const {email, password} = req.body;
    const currentUser = await User.findOne({email: email.toLowerCase()});
    if(!currentUser)
        throw {code: 403 , response: {message: 'wrong user/password'}}
    const matchPassword = await currentUser.matchPassword(password);
    if(matchPassword)
        return {token: authenticateUser(currentUser)};
    else
        throw {code: 403, response: {message: 'wrong user/password'}};
    
        
}

const changePassword = async ({currentPassword, newPassword, id}) => {
    if(!currentPassword || !newPassword || !id)
        throw {code: 400, response: {message: 'wrong parameters'}}
    const currentUser = await User.findById(id);
    const matchPassword = await currentUser.matchPassword(currentPassword);
    if(!currentUser || !matchPassword )
        throw {code: 403, response: {message: 'authorization error'}}
    const hashPassword = await currentUser.hashPassword(newPassword)
    await User.findByIdAndUpdate(id, {password: hashPassword});
    notifyChangePassword({name: currentUser.name, email : currentUser.email})
    return {message: 'the password was changed successful'}
}

const updateUser = async ({ idUser, id, state, securityLevel }) => {
    if( (!state && (!securityLevel || !securityLevels.includes(securityLevel.toLowerCase()) )) || (!idUser || idUser.length !== 24) || !id)
        throw {code: 400, response: { message: 'wrong parameters'}};
    if(securityLevel)
        securityLevel = securityLevel.toLowerCase();

    const authorizatedUser = await User.findById(id);
    const parameters = getFormatParameters({state, securityLevel}, ['state','securityLevel']);
    await User.findByIdAndUpdate(idUser, parameters);
    return { message: 'the user was update successfully'}
    
}

const getUsers = async (id, query) => {
    const queryParameters = {};
    if(query.id)
        queryParameters._id = query.id;
    const users = await User.find(queryParameters).lean();
    const formatUser = users.map(user => formatObjectResponse(user));
    return {users: formatUser};
}

const deleteUser = async (id) => {
    const currentUser = await User.findById(id);
    if(!currentUser)
        throw {code: 400, response: {message: 'wrong parameters'}};
    await User.findByIdAndDelete(id);
    return {message: 'the user was deleted successfully'}
}

router.post('/users/signup', isAuthenticated, correctSecurityLevel, (req,res) => {
    signupUser(req)
    .then((response) => {
        res.json(response)
    })
    .catch((e) => {
        responseCodeError(e, res)
    })
    
})

router.post('/users/login', (req,res) => {
    loginUser(req)
    .then((response) => {
        res.json(response)
    })
    .catch((e) => {
        responseCodeError(e, res)
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
        responseCodeError(e, res)
    })
})

router.put('/users', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { idUser, securityLevel, state } = req.body;
    const { id } = req.user;
    updateUser({ idUser, id, securityLevel, state })
    .then((response) => {
        res.status = 200;
        res.json(response);
    })
    .catch((e) => {
        responseCodeError(e, res)
    })

})

router.get('/users', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { id } = req.user;
    getUsers(id, req.query)
    .then((response) => {
        res.status = 200;
        res.json(response);
    })
    .catch((e) => {
        console.log(e);
        responseCodeError(e, res)
    })
})

router.delete('/users', isAuthenticated, correctSecurityLevel, (req,res) => {
    const { id } = req.body;
    deleteUser(id, user)
    .then((response) => {
        res.status = 200;
        res.json(response);
    })
    .catch((e) => {
        responseCodeError(e, res)
    })
})

router.get('/users/auth',isAuthenticated, (req, res) => {
    const {user} = req;
    if(user){
        res.status = 200;
        res.json(user);
    } else {
        responseCodeError(undefined,res)
    }
})

module.exports = router;