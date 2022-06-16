const router = require('express').Router();
const { isAuthenticated, correctSecurityLevel } = require('../middlewares/users.middleware');
const responseCodeError = require('../helpers/responseCodeError');
const { createAd, updateAd, deleteAd, getAds } = require('../controllers/publicity.controller');

router.use('/ad', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})


router.post('/ad', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { name, altText, link, type} = req.body;
    const creatorName = req.user.name;
    const creatorId = req.user.id;
    const { imageFile } = req.files;
    createAd({name, altText, link, type, creatorName, creatorId, imageFile})
    .then(response => {
        res.status = 200;
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res)
    })
})

router.get('/ad', async (req, res) => {
    try{
        const { type } = req.query;
        const ads = await (type ? Publicity.find({type}).lean() : Publicity.find().lean());
        const formatResponse = Array.isArray(ads) ? ads.map(ad => formatObjectResponse(ad)) : [formatObjectResponse(ads)];
        res.json(formatResponse);
    } catch(e){
        responseCodeError(e, res)
    } 
})

router.put('/ad', isAuthenticated, correctSecurityLevel, (req, res) => {
    updateAd(req.body)
    .then((response) => {
        res.json(response);
    })
    .catch((e) => {
        responseCodeError(e, res);
    })    
})

router.delete('/ad', isAuthenticated, correctSecurityLevel, (req, res) => {
    deleteAd(req.body.adId)
    .then(response => {
        res.json(response)
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})


module.exports = router;