const router = require('express').Router();
const upload = require('../helpers/storage');
const { isAuthenticated } = require('../helpers/auth');
const { host } = require('../config');
const Publicity = require('../models/Publicity');
const { correctSecurityLevel } = require('../helpers/securityLvl')
const responseCodeError = require('../helpers/responseCodeError');



router.use('/ad', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

router.post('/ad', isAuthenticated, correctSecurityLevel, upload.single('ad'), async (req, res) => {
    const { name, altText, link, type} = req.body;
    const creator = req.user.name;
    const urlImage = `${host}/public/${req.file.filename}`;
    try{
        const newAd = new Publicity({ name, altText, link, type, urlImage, creator });
        await newAd.save();
        return { message: 'the ad was added successful' }

    } catch(e){
        responseCodeError(e, res)
    }
})

router.get('/ad', async (req, res) => {
    try{
        const ads = await Publicity.find();
        

    } catch(e){
        responseCodeError(e, res)
    }
    
})


module.exports = router;