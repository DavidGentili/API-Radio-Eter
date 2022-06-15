const { securityLevels } = require('../helpers/securityLvl');

const checkName = (name) => (typeof(name) !== 'string' || name.length < 4) ?  false : true;
const checkHighlighted = (highlighted) => typeof(highlighted) !== 'boolean' ? false : true;
const checkCreatorName = (creatorName) => typeof(creatorName) !== 'string' ? false : true; 
const checkCreatorId = (creatorId) => typeof(creatorId) !== 'string' ? false : true; 
const checkDays = (days) => (!Array.isArray(days) || !days.every(day => typeof(day) === 'boolean') || days.length !== 7) ? false : true;
const checkSecurityLevel = (securityLevel) => (typeof(securityLevel) !== 'string' || !securityLevels.includes(securityLevel.toLowerCase())) ? false : true;
const checkId = (id) => (typeof(id) !== 'string' || id.length !== 24) ? false : true;
const checkBoolean = (bool) => (typeof(bool) !== 'boolean') ? false : true;
const checkEmail = (email) => {
    const re = /^([\da-zA-Z_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
    return (typeof(email) !== 'string' || !re.exec(email)) ? false : true;
}
    

//Se encargar de comprobar que la informacion para un signup sea correcta en ese caso retorna true
//caso contrario retorna retornar un string con el nombre del atributo incorrecto para retornar el error
const checkUserData = ({email, name, securityLevel}) => {
    if(!securityLevel || !checkSecurityLevel(securityLevel)) return 'security level';
    if(!email || !checkEmail(email)) return 'email'
    if(!name || !checkName) return 'name'
    return true;
}

//Se encarga de comprobar un horario de formato 24hs que tenga como separador los ':' entre las 
//horas y los minutos
const checkTime = (time) => {
    if(!time || typeof(time) !== 'string') return false;
    const [hours,minutes] = time.split(':');
    return hours !== ''
  	&& minutes !==''
  	&&((Number(hours) >= 0 && Number(hours) <= 24) 
    && (Number(minutes) >= 0 && Number(minutes) <= 60)) ? true : false
}


//Se encargar de comprobar la informacion de un programa, constatando su informacion principal definida 
//en el schema de la base de datos, en caso de que esten correctos los atributos retorna true, 
//caso constrario retorna el nombre del atributo incorrecto
const checkNewProgramData = ({name, startHour,finishHour, highlighted, days, creatorName, creatorId}) => {
    if(!name || !checkName(name)) return 'name';
    if(!startHour || !checkTime(startHour)) return 'start hour';
    if(!finishHour || !checkTime(finishHour)) return 'finish hour';
    if(!highlighted || !checkHighlighted(highlighted)) return 'highlighted';
    if(!days || !checkDays(days)) return 'days'
    if(!creatorName || !checkCreatorName(creatorName)) return 'creator name'
    if(!creatorId || !checkCreatorId(creatorId)) return 'creator id'
    return true; 
}

const checkUpdateProgramData = ({name, startHour, finishHour, highlighted, days, programId}) => {
    if(name && !checkName(name)) return 'name';
    if(startHour && !checkTime(startHour)) return 'start hour';
    if(finishHour && !checkTime(finishHour)) return 'finish hour';
    if(highlighted && !checkHighlighted(highlighted)) return 'highlighted';
    if(days && !checkDays(days)) return 'days'
    if(!programId || !checkId(programId)) return 'id';
    return true;
}

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
    if(!name || !checkName(name)) return 'name';
    if(!checkTransmissionDate(startTransmission, finishTransmission)) return 'transmission date';
    if(!creatorId || !checkCreatorId(creatorId)) return 'creator Id';
    if(!creatorName || !checkCreatorName(creatorName)) return 'creator name'
    return true;
}

const checkUpdateSpecialTransmission = ({ name, startTransmission, finishTransmission, active, transmissionId }) => {
    if(name && !checkName(name)) return 'name';
    if((startTransmission || finishTransmission) && !checkTransmissionDate(startTransmission, finishTransmission)) return 'transmission date';
    if((startTransmission  || !finishTransmission) && (!startTransmission || finishTransmission) && checkTransmissionDate(startTransmission,finishTransmission))
    if(active && !checkBoolean(active)) return 'active'
    if(!transmissionId || !checkId(transmissionId)) return 'transmission id';
    return true;
}



module.exports = {
    checkUserData,
    checkNewProgramData,
    checkUpdateProgramData,
    checkNewSpecialTransmission,
    checkUpdateSpecialTransmission,
}