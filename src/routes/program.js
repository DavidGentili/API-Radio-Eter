const router = require('express').Router();
const Program = require('../models/Program');
const upload = require('../helpers/storage');
const { host } = require('../config');
const { checkNewProgramData, checkUpdateProgramData } = require('../helpers/checkData')
const responseCodeError = require('../helpers/responseCodeError');
const { isAuthenticated } = require('../helpers/auth');
const { correctSecurityLevel } = require('../helpers/securityLvl');
const { getFormatParameters, formatObjectResponse } = require('../helpers/formatData');
const { removeFile } = require('../helpers/fileSystem');

//asigna los niveles de seguridad requeridos para esta ruta
router.use('/programs', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

//Middleware que controla si se envio el programId y si el programa es destacado
const isHighlighted = (req, res, next) => {
    const { programId } = req.body;
    if(!programId || programId.length !== 24)
        responseCodeError({ code: 400, response: { message: 'wrong program id'}}, res);
    Program.findById(programId)
    .then((currentProgram) => {
        if(currentProgram.highlighted)
            next();
        else
            throw {code: 400, response: { message: 'the program cannot have an image' }}
    })
    .catch((e) => {
        responseCodeError(e, res);
    })
}

//Si la informacion es correcta, crea el nuevo programa y lo guarda en la base de datos, 
//retornado un mensaje de exito
const createProgram = async (data) => {
    const check = checkNewProgramData(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `the ${check} information is wrong`}}
    const { name, startHour, finishHour, highlighted, days, creatorName, creatorId } = data;
    const newProgram = new Program({name, startHour, finishHour, highlighted, days, creatorName, creatorId});
    await newProgram.save();
    return { message: 'the program was created successfully'}
}


const updateProgram = async (data) => {
    const { programId } = data;
    const check  = checkUpdateProgramData(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `the ${check} information is wrong`}};
    const { name, startHour, finishHour, highlighted, days} = data;
    await Program.findByIdAndUpdate(programId, {name, startHour, finishHour, highlighted, days});
    return { message: 'the program was updated successfully'};
}

router.post('/programs', isAuthenticated, correctSecurityLevel, (req, res) => {
    createProgram({...req.body, creatorName: req.user.name, creatorId: req.user.id})
    .then(response => {
        res.json(response);
    })
    .catch(e => {
        console.log(e);
        responseCodeError(e,res);
    })
})

router.get('/programs', isAuthenticated, correctSecurityLevel, async (req,res) => {
    try{
        const parameters = getFormatParameters(req.query, ['highlighted', 'id']);
        const programs = await Program.find(parameters).lean();
        const formatResponse = Array.isArray(programs) ? programs.map(program => formatObjectResponse(program)) : [formatObjectResponse(programs)];
        res.json(formatResponse);
    }catch(e){
        responseCodeError(e, res);
    }
})


router.post('/programs/uploadimage', isAuthenticated, correctSecurityLevel, isHighlighted, upload.single('program'), async (req, res) => {
    const { programId } = req.body;
    try{
        const currentProgram = await Program.findById(programId);
        if(currentProgram.urlImg){
            removeFile(urlImg.replace(host,'.'));
        }
        currentProgram.urlImg = `${host}/public/${req.file.filename}`;
        await currentProgram.save();
        res.json({message: 'successful file upload'});
    } catch(e){
        responseCodeError(e,res);
    }    
})

router.put('/programs', isAuthenticated, correctSecurityLevel, (req, res) => {
    updateProgram(req.body)
    .then(response => {
        res.json(response);
    })
    .catch(e => {
        responseCodeError(e, res);
    })
})


module.exports = router;