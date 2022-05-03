const router = require('express').Router();
const upload = require('../helpers/storage');
const { isAuthenticated } = require('../helpers/auth');
const { host } = require('../config');
const Publicity = require('../models/Publicity');
const { correctSecurityLevel } = require('../helpers/securityLvl')
const responseCodeError = require('../helpers/responseCodeError');
const { formatObjectResponse, getFormatParameters } = require('../helpers/formatData');
const removeFile = require('../helpers/fileSystem');

router.use('/ad', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

const updateAd = async (data) => {
    const { name, altText, link, type, adId } = data;
    if(!adId && adId.lenght !== 24 )
        throw {code: 400, response: { message: 'wrong parameters'}};
    const formatAttributes = getFormatParameters({name, altText, link, type }, [ 'name', 'altText', 'link', 'type' ]);
    await Publicity.findByIdAndUpdate(adId, formatAttributes);
    return { message: 'ad updated successfully' }
}

const deleteAd = async (adId) => {
    if(!adId && adId.lenght !== 24)
        throw {code: 400, response: { message: 'wrong parameters'}};
    const ad = await Publicity.findById(adId).lean();
    if(!ad)
        throw {code: 400, response: { message: 'wrong parameters'}};
    const url = ad.urlImage;
    await Publicity.findByIdAndDelete(adId);
    removeFile(url.replace(host,'.'));
    return { message: 'the ad was removed sucessfull'}
}

router.post('/ad', isAuthenticated, correctSecurityLevel, upload.single('ad'), async (req, res) => {
    const { name, altText, link, type} = req.body;
    const creatorName = req.user.name;
    const creatorId = req.user.id;
    const urlImage = `${host}/public/${req.file.filename}`;
    try{
        const newAd = new Publicity({ name, altText, link, type, urlImage, creatorName, creatorId });
        await newAd.save();
        res.json({ message: 'the ad was added successful' });

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
        conse
        responseCodeError(e, res);
    })
})


module.exports = router;