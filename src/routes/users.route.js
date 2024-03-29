const router = require('express').Router();
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');
const responseCodeError = require('../helpers/responseCodeError');
const { signupUser, loginUser, changePassword, updateUser, getUsers, deleteUser } = require('../controllers/users.controller');

router.use('/users',(req, res, next) => {
    req.securityLevelRequired = ['master'];
    next();
})

router.get('/users', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { id, name, state, securityLevel, email } = req.query ? req.query : {};
    getUsers({id, name, state, securityLevel, email})
    .then((response) => {
        res.status = 200;
        res.json(response);
    })
    .catch((e) => {
        responseCodeError(e, res)
    })
})

router.post('/users/signup', isAuthenticated, correctSecurityLevel, (req,res) => {
    const { name, email, securityLevel = 'editor' } = req.body
    signupUser({ name, email, securityLevel, state : 'active' })
    .then((response) => {
        res.status = 200;
        res.json(response)
    })
    .catch((e) => {
        responseCodeError(e, res)
    })
    
})

router.post('/users/login', (req,res) => {
    const {email, password} = req.body;
    loginUser({ email, password })
    .then((response) => {
        res.status = 200;
        res.json(response)
    })
    .catch((e) => {
        responseCodeError(e, res)
    })
})

router.put('/users/password', isAuthenticated, (req,res) => {
    const {currentPassword, newPassword} = req.body;
    const {id} = req.user;
    changePassword({ currentPassword, newPassword, id })
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
    updateUser({ userId : idUser , id, securityLevel, state })
    .then((response) => {
        res.status = 200;
        res.json(response);
    })
    .catch((e) => {
        responseCodeError(e, res)
    })

})

router.delete('/users', isAuthenticated, correctSecurityLevel, (req,res) => {
    const { id } = req.body;
    deleteUser(id)
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