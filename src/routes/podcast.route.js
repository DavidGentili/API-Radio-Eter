const { getPodcast, createPodcast, updatePodcast, deletePodcast, addEpisode, removeEpisode, getEpisodesOfPodcast } = require('../controllers/podcast.controller');
const responseCodeError = require('../helpers/responseCodeError');
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');

const router = require('express').Router();



router.use('/podcast', (req, res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

router.get('/podcast', (req, res) => {
    const { active, title } = req.query;
    getPodcast({ active, title })
        .then(response => {
            res.status = 200;
            res.json(response);
        })
        .catch(e => {
            responseCodeError(e, res);
        })
})

router.post('/podcast', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { title, description, tags, urls, imgUrl, active } = req.body;

    createPodcast({ title, description, tags, urls, imgUrl, active })
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})

router.put('/podcast', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { podcastId, title, description, tags, urls, imgUrl, active, episodesId } = req.body;
    updatePodcast({ title, description, tags, urls, imgUrl, active, episodesId }, podcastId)
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})

router.delete('/podcast', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { podcastId } = req.body;
    deletePodcast(podcastId)
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})

router.post('/podcast/episode', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { podcastId, title, description, urls, imgUrl, active = true } = req.body;
    addEpisode(podcastId, { title, description, urls, imgUrl, active })
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})

router.delete('/podcast/episode', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { podcastId, episodeId } = req.body;
    removeEpisode(podcastId, episodeId)
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})

router.get('/podcast/episode', (req, res) => {
    const { podcastId } = req.query;
    getEpisodesOfPodcast(podcastId)
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})

module.exports = router;