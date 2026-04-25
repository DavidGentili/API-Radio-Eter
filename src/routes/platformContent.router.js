const router = require('express').Router();
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');
const responseCodeError = require('../helpers/responseCodeError');
const { getPlatformContent, getPlatformContentById, getPlatformContentByName, createPlatformContent, updatePlatformContent, deletePlatformContent, addContent, removeContent } = require('../controllers/platformContent.controller');


router.use('/platform-content', (req, res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})


router.get('/platform-content', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { name, type } = req.query;
    getPlatformContent({ name, type })
        .then(response => {
            res.status = 200;
            res.json(response);
        }).catch(e => {
            responseCodeError(e, res)
        })
})

router.get('/platform-content/name/:name', (req, res) => {
    const { name } = req.params;
    getPlatformContentByName(name)
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res)
        })
})

router.get('/platform-content/:id', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { id } = req.params;
    getPlatformContentById(id)
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res)
        })
})

router.post('/platform-content', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { name, type } = req.body;
    createPlatformContent({ name, type })
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res)
        })
})

router.post('/platform-content/:id/content', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { id } = req.params;
    const { title, src, order, link, active } = req.body;
    const content = { title, src, order, link, active };
    addContent(id, content)
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res)
        })
})

router.delete('/platform-content/:id/content/:contentId', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { id, contentId } = req.params;
    removeContent(id, contentId)
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res)
        })
})


router.put('/platform-content/:id', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;
    updatePlatformContent(id, { name, type })
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res)
        })
})

router.delete('/platform-content/:id', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { id } = req.params;
    deletePlatformContent(id)
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res)
        })
})

module.exports = router;