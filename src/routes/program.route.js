const router = require('express').Router();
const responseCodeError = require('../helpers/responseCodeError');
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');
const { getPrograms, createProgram, updateProgram, deleteProgram } = require('../controllers/program.controller');

//asigna los niveles de seguridad requeridos para esta ruta
router.use('/programs', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})


router.post('/programs', isAuthenticated, correctSecurityLevel, (req, res) => {
    const creatorId = req.user.id;
    const creatorName = req.user.name;
    const imageFile = ( req.files && req.files.imageFile) ? req.files.imageFile : undefined;
    const highlighted = (typeof(req.body.highlighted) !== 'undefined' && req.body.highlighted.toLowerCase() === 'true') ? true : false; 
    const days = req.body.days ? req.body.days.split(',').map(day => day==='true' ? true : false) : undefined;
    createProgram({ ...req.body, creatorName, creatorId, imageFile, highlighted, days })
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})

router.get('/programs', isAuthenticated, correctSecurityLevel, async (req,res) => {
    const { highlighted, id } = req.query;
    getPrograms(highlighted, id)
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})

router.put('/programs', isAuthenticated, correctSecurityLevel, (req, res) => {
    const imageFile = (req.files && req.files.imageFile) ? req.files.imageFile : undefined; 
    const highlighted = (typeof(req.body.highlighted) !== 'undefined') ? (req.body.highlighted.toLowerCase() === 'true' ? true : false) : undefined; 
    const days =  (req.body.days) ? req.body.days.split(',').map(day => day === 'true' ? true : false) : undefined;
    updateProgram({ ...req.body, imageFile, highlighted, days})
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})

router.delete('/programs', isAuthenticated, correctSecurityLevel, async (req, res) =>{
    const { programId } = req.body;
    deleteProgram(programId)
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})


module.exports = router;