const router = require('express').Router();
const { updateEpisode, getLatestEpisode } = require('../controllers/episodes.controller');
const { getEpisodesWithPodcast, getLatestEpisodesWithPodcast } = require('../controllers/podcast.controller')
const responseCodeError = require('../helpers/responseCodeError');
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');

router.use('/episode', (req, res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

router.use('/episodes/withPodcast', (req, res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

router.put('/episode', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { episodeId, title, description, urls, imgUrl, active = true } = req.body;
    updateEpisode(episodeId, { title, description, urls, imgUrl, active })
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res);
        })
})

router.get('/episode/latest', (req, res) => {
    const { size = 3 } = req.query;
    getLatestEpisode(size)
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res);
        })
})

router.get('/episodes/withPodcast', isAuthenticated, correctSecurityLevel, (req, res) => {
    getEpisodesWithPodcast()
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res);
        })
})


router.get('/episodes/withPodcast/latest', (req, res) => {
    const { size = 3 } = req.query;
    getLatestEpisodesWithPodcast(size)
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res);
        })
})

module.exports = router;