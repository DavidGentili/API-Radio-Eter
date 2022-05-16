const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');
const { formatObjectResponse } = require('../helpers/formatData');
const responseCodeError = require('../helpers/responseCodeError');
const { correctSecurityLevel } = require('../helpers/securityLvl');
const { compareStartHour } = require('../helpers/compare');
const Program = require('../models/Program');

router.use('/programGrid', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

const getFullGrid = async () => {
    const grid = new Array(7).fill(new Array);
    const queryPrograms = await Program.find().lean();
    const programs = (Array.isArray(queryPrograms)) ? queryPrograms.map(program => formatObjectResponse(program)) : [formatObjectResponse(queryPrograms)];
    grid.forEach((day, index, array) => {
        const filterPrograms = programs.filter(program => program.days[index])
        filterPrograms.sort(compareStartHour)
        array[index] = filterPrograms;
    })
    return grid;
}

router.get('/programgrid', (req, res) => {
    getFullGrid()
    .then(response => res.json(response))
    .catch(e => responseCodeError(e, res));
})


module.exports = router;