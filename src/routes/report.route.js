const router = require('express').Router();
const responseCodeError = require('../helpers/responseCodeError');
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middlewares');
const { getReport, createReport, updateReport, deleteReport } = require('../controllers/report.controller');


router.use('/report', (req , res, next) => {
    req.securityLevelRequired = ['editor','admin', 'master'];
    next();
})

router.get('/report', (req, res) => {
    const { id, title, active, creatorId, creatorName, tags } = req.query;
    getReport({ id, title, active, creatorId, creatorName, tags })
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})

router.post('/report', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { title, description, content, active = true, mainMediaUrl, tags} = req.body;
    const creatorId = req.user.id;
    const creatorName = req.user.name;
    const reportData = { title, description, content, active, mainMediaUrl, creatorId, creatorName, tags}
    createReport(reportData)
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})

router.put('/report', isAuthenticated, correctSecurityLevel, (req, res) => {
    updateReport(req.body)
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})

router.delete('/report', isAuthenticated, correctSecurityLevel, (req, res) => {
    deleteReport(req.body.reportId)
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e,res);
    })
})

module.exports = router