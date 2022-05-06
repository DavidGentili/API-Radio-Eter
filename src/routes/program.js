const router = require('express').Router();
const Program = require('../models/Program');
const { checkProgramData } = require('../helpers/checkData')
const responseCodeError = require('../helpers/responseCodeError');
const { isAuthenticated } = require('../helpers/auth');
const { correctSecurityLevel } = require('../helpers/securityLvl');
const { getFormatParameters, formatObjectResponse } = require('../helpers/formatData');

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

const getPrograms = async (query) => {

}

router.post('/programs', isAuthenticated, correctSecurityLevel, (req, res) => {
    createProgram(req.body)
    .then(response => {
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})

router.get('/programs', async (req,res) => {
    try{
        const parameters = getFormatParameters(req.query, ['highlighted', 'id']);
        const programs = await Program.find(parameters);
        const formatResponse = Array.isArray(programs) ? programs.map(program => formatObjectResponse(program)) : [formatObjectResponse(programs)];
        res.json(formatResponse);
    }catch(e){
        responseCodeError(e, res);
    }

})




module.exports = router;