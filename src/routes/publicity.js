const router = require('express').Router();
const upload = require('../helpers/storage');
const { isAuthenticated } = require('../helpers/auth');
const { host } = require('../config');
const Publicity = require('../models/Publicity');
const { correctSecurityLevel } = require('../helpers/securityLvl')

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
        const {code = 500, response = {message: 'Internal Server Error'}} = e;
        res.statusCode = code;
        res.json(response)
    }
})

router.get('/ad', async (req, res) => {
    const ads = await Publicity.find();
    console.log(ads);
})


module.exports = router;