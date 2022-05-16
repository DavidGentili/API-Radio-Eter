const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');
const { correctSecurityLevel } = require('../helpers/securityLvl');
const { checkNewSpecialTransmission } = require('../helpers/checkData');
const SpecialTransmission = require('../models/SpecialTransmission');
const responseCodeError = require('../helpers/responseCodeError');

router.use('/specialtransmission', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

const createSpecialTransmission = async (data) => {
    const check = checkNewSpecialTransmission(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `the ${check} information is wrong`}};
    const newTransmission = await new SpecialTransmission(data);
    await newTransmission.save();
    return { message: 'the transmission was created successfully' };
}

router.post('/specialtransmission', isAuthenticated, correctSecurityLevel, (req, res) => {
    const data = {
        name: req.body.name,
        startTransmission : new Date(req.body.startTransmission),
        finishTransmission: new Date(req.body.finishTransmission),
        creatorName: req.user.name,
        creatorId: req.user.id,
    }
    
    createSpecialTransmission(data)
    .then(response => {
        res.json(response);
    })
    .catch(e => {
        console.log(e);
        responseCodeError(e, res);
    })
})

router.get('/specialtransmission', (req, res) => {
    
})

module.exports = router;