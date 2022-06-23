const router = require('express').Router();
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');
const responseCodeError = require('../helpers/responseCodeError');
const { getDayGrid, getFullGrid, getTranmission } = require('../controllers/programGrid.controller');

router.use('/programGrid', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})



router.get('/programgrid', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { day } = req.query;
    const promise = (day) ? getDayGrid(day) : getFullGrid;
    promise()
    .then(response => res.json(response))
    .catch(e => responseCodeError(e, res));
})

router.get('/currentprogram', (req, res) => {
    getTranmission()
    .then((transmission) => {
        if(transmission)
            res.json(transmission);
        else{
            getProgram()
            .then(program => res.json(program ? program : {name: 'Radio Eter MDP' }) )
        }
    })
    .catch(e => responseCodeError(e, res));
})


module.exports = router;