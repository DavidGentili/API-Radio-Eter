const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');
const { formatObjectResponse } = require('../helpers/formatData');
const responseCodeError = require('../helpers/responseCodeError');
const { correctSecurityLevel } = require('../helpers/securityLvl');
const { compareStartHour } = require('../helpers/compare');
const Program = require('../models/Program');
const SpecialTransmission = require('../models/SpecialTransmission');

router.use('/programGrid', (req , res, next) => {
    req.securityLevelRequired = ['admin', 'master'];
    next();
})

const getFullGrid = async () => {
    const grid = new Array(7).fill(new Array);
    const queryPrograms = await Program.find().lean();
    const programs = (Array.isArray(queryPrograms)) ? queryPrograms.map(program => formatObjectResponse(program)) : [formatObjectResponse(queryPrograms)];
    grid.forEach((day, index, array) => {
        const programsOfTheDay = programs.filter(program => program.days[index])
        programsOfTheDay.sort(compareStartHour)
        array[index] = programsOfTheDay;
    })
    return grid;
}

const getDayGrid = (day) => {
    return async () => {
        const filter = {};
        filter[`days.${day}`] = true; 
        const queryPrograms = await Program.find(filter).lean();
        const programs = (Array.isArray(queryPrograms)) ? queryPrograms.map(program => formatObjectResponse(program)) : [formatObjectResponse(queryPrograms)];
        programs.sort(compareStartHour);
        return programs
    }
}

const getTranmission = async () => {
    let transmissions = await SpecialTransmission.find({ active : true }).lean();
    if(!transmissions)
        return undefined;
    if(!Array.isArray(transmissions))
        transmissions = [transmissions];
    const now = new Date(Date.now())
    const currentTranmission = transmissions.find(transmission => (transmission.startTransmission < now && transmission.finishTransmission));
    return currentTranmission !== undefined ? formatObjectResponse(currentTranmission) : undefined;
}

const findCurrentProgram = (program) => {
    const now = new Date(Date.now());
    const startDate = new Date();
    const finishDate = new Date();
    const [startHour, startMinute] = program.startHour.split(':');
    const [finishHour, finishMinute] = program.finishHour.split(':');
    startDate.setHours(Number(startHour), Number(startMinute), 0);
    finishDate.setHours(Number(finishHour),Number(finishMinute),0);
    return (startDate <= now && finishDate >= now) ? true : false;
}

const getProgram = async () => {
    const today = new Date(Date.now()).getDay();
    const programs = await getDayGrid(today-1)();
    const currentprogram = programs.find(program => findCurrentProgram(program));
    return currentprogram;
    
}

router.get('/programgrid', isAuthenticated, correctSecurityLevel, (req, res) => {
    const { day } = req.query;
    const promise = (day) ? getDayGrid(day) : getFullGrid;
    promise()
    .then(response => res.json(response))
    .catch(e => responseCodeError(e, res));
})

router.get('/currentprogram', (req, res) => {
    getTranmission()
    .then((transmission) => {
        if(transmission)
            res.json(transmission);
        else{
            getProgram()
            .then(program => res.json(program ? program : {name: 'Radio Eter MDP' }) )
        }
    })
    .catch(e => responseCodeError(e, res));
})


module.exports = router;