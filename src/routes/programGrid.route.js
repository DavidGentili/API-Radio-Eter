const router = require('express').Router();
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');
const responseCodeError = require('../helpers/responseCodeError');
const { getFullGrid, getCurrentProgram } = require('../controllers/programGrid.controller');

router.use('/programGrid', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})



router.get('/programgrid', isAuthenticated, correctSecurityLevel, (req, res) => {
    getFullGrid()
    .then(response => res.json(response))
    .catch(e => responseCodeError(e, res));
})

router.get('/currentprogram', (req, res) => {
    getCurrentProgram()
    .then(response => res.json(response))
    .catch(e => responseCodeError(e));
})


module.exports = router;