const router = require('express').Router();
const Program = require('../models/Program');

router.use('/programs', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})


router.get('/programs', (req,res) => {
    
})

router.post('/programs', async (req, res) => {
    const { name, startHour, finishHour, highlighted, days } = req.body;
    const newProgram = new Program({name, startHour, finishHour, highlighted, days});
    await newProgram.save()
    
    res.json({message : 'all its ok'});
})


module.exports = router;