const router = require('express').Router();
const { updateEpisode, getLatestEpisode } = require('../controllers/episodes.controller');
const responseCodeError = require('../helpers/responseCodeError');
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');

router.use('/podcast', (req, res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

router.put('/episode', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { episodeId, title, description, urls, imgUrl, order, active } = req.body;
    updateEpisode(episodeId, { title, description, urls, imgUrl, order, active })
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res);
        })
})

router.get('episode/latest', (req, res) => {
    getLatestEpisode(3)
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res);
        })
})


module.exports = router;