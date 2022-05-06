const router = require('express').Router();
const Program = require('../models/Program');
const { checkProgramData } = require('../helpers/checkData')
const responseCodeError = require('../helpers/responseCodeError');
const { isAuthenticated } = require('../helpers/auth');
const { correctSecurityLevel } = require('../helpers/securityLvl');

router.use('/programs', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

const createProgram = async (data) => {
    const check = checkProgramData(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `the ${check} information is wrong`}}
    const { name, startHour, finishHour, highlighted, days } = data;
    const newProgram = new Program({name, startHour, finishHour, highlighted, days});
    await newProgram.save();
    return { message: 'the program was created successfully'}
}

router.get('/programs', (req,res) => {
    
})

router.post('/programs', isAuthenticated, correctSecurityLevel, (req, res) => {
    createProgram(req.body)
    .then(response => {
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })

    
    
    res.json({message : 'all its ok'});
})


module.exports = router;