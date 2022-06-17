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
    const { imageFile } = req.files
    createProgram({...req.body, creatorName, creatorId, imageFile})
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        console.log(e);
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
    const { imageFile } = req.files; 
    updateProgram({ ...req.body, imageFile})
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