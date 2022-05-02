const router = require('express').Router();
const upload = require('../helpers/storage');
const { host, port} = require('../config');

router.post('/publicity', upload.single('publicity'), (req, res) => {
    console.log(req.file);
    const urlImage = `${host}:${port}/public/${req.file.filename}`;
})


module.exports = router;