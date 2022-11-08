const router = require('express').Router();
const { getFilesWithoutData, createFile, deleteFile } = require('../controllers/storageFile.controller');
const responseCodeError = require('../helpers/responseCodeError');
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');

//asigna los niveles de seguridad requeridos para esta ruta
router.use('/media', (req , res, next) => {
    req.securityLevelRequired = ['editor','admin', 'master'];
    next();
})

router.get('/media', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { id, urlName, name } = req.query;
    getFilesWithoutData( { id, urlName, name } )
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})

router.post('/media', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { name, type = 'Normal' } = req.body;
    const { mediaFile } =  req.files;
    createFile( { name, file : mediaFile, type } )
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})

router.delete('/media', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { mediaId, urlName } = req.body;
    deleteFile( {fileId : mediaId, urlName} )
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})

 
module.exports = router;