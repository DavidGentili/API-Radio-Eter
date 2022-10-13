const router = require('express').Router();
const { getFilesWithoutData, getFiles } = require('../controllers/storageFile.controller');

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
    const { file } =  req.files;
    createFile( { name, file, type } )
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})


module.exports = router;