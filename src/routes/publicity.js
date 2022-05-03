const router = require('express').Router();
const upload = require('../helpers/storage');
const { isAuthenticated } = require('../helpers/auth');
const { host } = require('../config');
const Publicity = require('../models/Publicity');
const { correctSecurityLevel } = require('../helpers/securityLvl')
const responseCodeError = require('../helpers/responseCodeError');
const { formatObjectResponse } = require('../helpers/formatData');



router.use('/ad', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

router.post('/ad', isAuthenticated, correctSecurityLevel, upload.single('ad'), async (req, res) => {
    const { name, altText, link, type} = req.body;
    const creatorName = req.user.name;
    const creatorId = req.user.id;
    const urlImage = `${host}/public/${req.file.filename}`;
    try{
        const newAd = new Publicity({ name, altText, link, type, urlImage, creatorName, creatorId });
        await newAd.save();
        return { message: 'the ad was added successful' }

    } catch(e){
        responseCodeError(e, res)
    }
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


module.exports = router;