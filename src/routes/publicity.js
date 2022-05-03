const router = require('express').Router();
const upload = require('../helpers/storage');
const { host } = require('../config');
const Publicity = require('../models/Publicity');



const addNewAd = async ({name, altText, link, type, urlImage, user}) => {
    const newAd = new Publicity({name, altText, link, type, urlImage});
    await newAd.save();
}

router.post('/ad', upload.single('ad'), (req, res) => {
    const { name, altText, link, type} = req.body;
    const urlImage = `${host}/public/${req.file.filename}`;


    res.json({ message: 'Ad was added successfully' });
})

router.get('/ad', async (req, res) => {
    const ads = await Publicity.find();
    console.log(ads);
})


module.exports = router;