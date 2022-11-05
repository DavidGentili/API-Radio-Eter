const { checkTime, checkName, checkId, checkDays, checkCreatorId, checkHighlighted, checkParameters } = require('./checkData');
const { isString, } = require('../checkTypes');

const programKeys = [ 
    'name', 
    'startHour', 
    'finishHour', 
    'days',
    'highlighted',
    'urlImage',
    'creatorName',
    'creatorId',
]

const checkNewProgramData = (programData) => {
    const {name, startHour, finishHour, highlighted, days, creatorName, creatorId, urlImage} = programData
    if(!checkParameters(programData, programKeys));
    if(!name || !checkName(name)) return 'Nombre';
    if(!startHour || !checkTime(startHour)) return 'Hora de inicio';
    if(!finishHour || !checkTime(finishHour)) return 'Hora de finalizacion';
    if(highlighted === undefined || !checkHighlighted(highlighted)) return 'Destacado';
    if(!days || !checkDays(days)) return 'Dias';
    if(urlImage && !isString(urlImage)) return 'Url de la imagen';
    if(!creatorName || !isString(creatorName)) return 'Nombre del creador';
    if(!creatorId || !checkCreatorId(creatorId)) return 'Id del creador';
    return true; 
}


const checkUpdateProgramData = ({name, startHour, finishHour, highlighted, days, programId, urlImage}) => {
    if(name && !checkName(name)) return 'Nombre';
    if(startHour && !checkTime(startHour)) return 'Hora de inicio';
    if(finishHour && !checkTime(finishHour)) return 'Hora de finalizacion';
    if(highlighted !== undefined && !checkHighlighted(highlighted)) return 'Destacado';
    if(urlImage && !isString(urlImage)) return 'Url de la imagen';
    if(days && !checkDays(days)) return 'Dias'
    if(!programId || !checkId(programId)) return 'id';
    return true;
}


module.exports = {
    checkNewProgramData,
    checkUpdateProgramData
}