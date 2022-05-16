const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');
const { correctSecurityLevel } = require('../helpers/securityLvl');
const { checkNewSpecialTransmission, checkUpdateSpecialTransmission } = require('../helpers/checkData');
const SpecialTransmission = require('../models/SpecialTransmission');
const responseCodeError = require('../helpers/responseCodeError');
const { getFormatParameters, formatObjectResponse } = require('../helpers/formatData');

router.use('/specialtransmission', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

const updateActiveTransmission = async () => {
    const now = new Date(Date.now());
    const transmissions = await SpecialTransmission.find({active: true}).lean();
    transmissions.forEach( async (transmission) => {
        if(now > transmission.finishTransmission)
            await SpecialTransmission.findByIdAndUpdate(transmission._id, {active : false});
    })
}

const updateTransmission = async (data) => {
    const { transmissionId } = data; 
    const check = checkUpdateSpecialTransmission(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `the ${check} information is wrong`}};
    const { name, startTransmission, finishTransmission, active } = data;
    await SpecialTransmission.findByIdAndUpdate(transmissionId, { name, startTransmission, finishTransmission, active });
    return { message: 'the transmission was updated successfully' };
}

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
    updateActiveTransmission()
    .catch(e => console.log(e))
    createSpecialTransmission(data)
    .then(response => res.json(response) )
    .catch(e => responseCodeError(e, res) )
})

router.get('/specialtransmission', isAuthenticated, correctSecurityLevel, async (req, res) => {
    if(req.query.active) 
        req.query.active = (req.query.active === 'true') ? true : false;
    try{
        const parameters = getFormatParameters(req.query, ['active','name']);
        const transmissions = await SpecialTransmission.find(parameters).lean();
        const formatTransmission = Array.isArray(transmissions) ? transmissions.map(transmission => formatObjectResponse(transmission)) : [formatObjectResponse(transmissions)];
        res.json(formatTransmission);
    } catch(e){
        responseCodeError(e, res);
    }
})

router.put('/specialTransmission', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { name, startTransmission, finishTransmission, active, transmissionId } = req.body;
    const data = {
        name,
        startTransmission : startTransmission ? new Date(startTransmission) : undefined,
        finishTransmission : finishTransmission ? new Date(finishTransmission) : undefined,
        active,
        transmissionId,
    }
    updateActiveTransmission()
    .catch(e => console.log(e));
    updateTransmission(data)
    .then(response => res.json(response))
    .catch(e => responseCodeError(e, res))

})

router.delete('/specialtransmission', isAuthenticated, correctSecurityLevel, async (req, res) => {
    const { transmissionId } = req.body;
    try{
        if(typeof(transmissionId) !== 'string' || transmissionId.length !== 24)
            throw { code: 400, response: { message: 'wrong tranmission id' }};
        const currentTransmission = await SpecialTransmission.findById(transmissionId);
        if(!currentTransmission)
            throw { code: 400, response: { message: 'wrong tranmission id' }};
        await SpecialTransmission.findByIdAndDelete(transmissionId);
        res.json({ message: 'the transmission was deleted successfully' });
    } catch(e){
        responseCodeError(e, res);
    }
})


module.exports = router;