const { checkCreatorId, checkName, checkId } = require('./checkData');
const { isArray, isBoolean } = require('../checkTypes');


const transmissionKeys = [ 
    'name', 
    'startTransmission', 
    'finishTransmission', 
    'active',
]


const checkTransmissionDate = (startDate, finishDate) => {
    return (!startDate
    || !finishDate
    || typeof(startDate) !== 'object'
    || typeof(finishDate) !== 'object'
    || startDate.toString() === 'Invalid Date'
    || finishDate.toString() === 'Invalid Date'
    || startDate > finishDate) ? false : true;
}

const checkNewSpecialTransmission = ({ name, startTransmission, finishTransmission, creatorName, creatorId }) => {
    if(!name || !checkName(name)) return 'Nombre';
    if(!checkTransmissionDate(startTransmission, finishTransmission)) return 'fecha de transmision';
    if(!creatorId || !checkCreatorId(creatorId)) return 'Id del creador';
    if(!creatorName || !isArray(creatorName)) return 'Nombre del creador'
    return true;
}

const checkUpdateSpecialTransmission = ({ name, startTransmission, finishTransmission, active, transmissionId }) => {
    if(name && !checkNameOrTitle(name)) return 'Nombre';
    if((startTransmission || finishTransmission) && !checkTransmissionDate(startTransmission, finishTransmission)) return 'fecha de transmision';
    if((startTransmission  || !finishTransmission) && (!startTransmission || finishTransmission) && checkTransmissionDate(startTransmission,finishTransmission))
    if(active && !isBoolean(active)) return 'activo'
    if(!transmissionId || !checkId(transmissionId)) return 'Id de transmision';
    return true;
}


module.exports = {
    checkNewSpecialTransmission,
    checkUpdateSpecialTransmission
}