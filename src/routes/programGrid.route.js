const router = require('express').Router();
const responseCodeError = require('../helpers/responseCodeError');
const { getFullGrid, getCurrentProgram } = require('../controllers/programGrid.controller');



router.get('/programgrid', (req, res) => {
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