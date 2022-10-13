const router = require('express').Router();
const { getFilesWithoutData, createFile, deleteFile } = require('../controllers/storageFile.controller');
const responseCodeError = require('../helpers/responseCodeError');

router.get('/media', (req, res) => {
    const { id, urlName } = req.query;
    getFilesWithoutData( { id, urlName } )
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})

router.post('/media', (req, res) => {
    const { name, type } = req;
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

router.delete('/media', (req, res) => {
    const { id, urlName } = req.query;
    deleteFile( {id, urlName} )
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})


module.exports = router;