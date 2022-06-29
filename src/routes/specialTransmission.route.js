const router = require('express').Router();
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');
const responseCodeError = require('../helpers/responseCodeError');
const { createSpecialTransmission, updateTransmission, getTransmissions, deleteTransmission} = require('..//controllers/specialTransmission.controller');

router.use('/specialtransmission', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})



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
        res.status = 200;
        res.json(response);
    })
    .catch(e => responseCodeError(e));
})

router.get('/specialtransmission', isAuthenticated, correctSecurityLevel, async (req, res) => {
    const params = {
        name : req.query.name,
        active : (req.query.active) ? (req.query.active === 'true' ? true : false) : undefined
    }
    getTransmissions(params)
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => responseCodeError(e));

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
    updateTransmission(data)
    .then(response => {
        res.status =
        res.json(response)
    })
    .catch(e => responseCodeError(e, res))

})

router.delete('/specialtransmission', isAuthenticated, correctSecurityLevel, async (req, res) => {
    const { transmissionId } = req.body;
    deleteTransmission( transmissionId )
    .then(response => {
        res.status =
        res.json(response)
    })
    .catch(e => responseCodeError(e, res))
})


module.exports = router;