const router = require('express').Router();
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middleware');
const responseCodeError = require('../helpers/responseCodeError');
const { signupUser, loginUser, changePassword, updateUser, getUsers, deleteUser } = require('../controllers/users.controller');

router.use('/users',(req, res, next) => {
    req.securityLevelRequired = ['master'];
    next();
})


router.post('/users/signup', isAuthenticated, correctSecurityLevel, (req,res) => {
    const { name, email, securityLevel } = req.body
    signupUser({ name, email, securityLevel })
    .then((response) => {
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
    const searchId = (req.query && req.query.id) ? req.query.id : null;
    getUsers(searchId)
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