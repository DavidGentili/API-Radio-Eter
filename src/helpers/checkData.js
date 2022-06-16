const { securityLevels } = require('../helpers/securityLvl');

const checkName = (name) => (typeof(name) !== 'string' || name.length < 4) ?  false : true;
const checkHighlighted = (highlighted) => typeof(highlighted) !== 'boolean' ? false : true;
const checkCreatorName = (creatorName) => typeof(creatorName) !== 'string' ? false : true; 
const checkCreatorId = (creatorId) => typeof(creatorId) !== 'string' ? false : true; 
const checkDays = (days) => (!Array.isArray(days) || !days.every(day => typeof(day) === 'boolean') || days.length !== 7) ? false : true;
const checkSecurityLevel = (securityLevel) => (typeof(securityLevel) !== 'string' || !securityLevels.includes(securityLevel.toLowerCase())) ? false : true;
const checkId = (id) => (typeof(id) !== 'string' || id.length !== 24) ? false : true;
const checkBoolean = (bool) => (typeof(bool) !== 'boolean') ? false : true;
const checkTypePublicity = (type) => (typeof(type) !== 'string' || type.toLowerCase() !== 'oficial' || type.toLowerCase() !== 'standard') ? false : true;
const checkEmail = (email) => {
    const re = /^([\da-zA-Z_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
    return (typeof(email) !== 'string' || !re.exec(email)) ? false : true;
}
    

//Se encargar de comprobar que la informacion para un signup sea correcta en ese caso retorna true
//caso contrario retorna retornar un string con el nombre del atributo incorrecto para retornar el error
const checkUserData = ({email, name, securityLevel}) => {
    if(!securityLevel || !checkSecurityLevel(securityLevel)) return 'Nivel de seguridad';
    if(!email || !checkEmail(email)) return 'Mail'
    if(!name || !checkName) return 'Nombre'
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
    if(!name || !checkName(name)) return 'Nombre';
    if(!startHour || !checkTime(startHour)) return 'Hora de inicio';
    if(!finishHour || !checkTime(finishHour)) return 'Hora de finalizacion';
    if(!highlighted || !checkHighlighted(highlighted)) return 'Destacado';
    if(!days || !checkDays(days)) return 'Dias'
    if(!creatorName || !checkCreatorName(creatorName)) return 'Nombre del creador'
    if(!creatorId || !checkCreatorId(creatorId)) return 'Id del creador'
    return true; 
}

const checkUpdateProgramData = ({name, startHour, finishHour, highlighted, days, programId}) => {
    if(name && !checkName(name)) return 'Nombre';
    if(startHour && !checkTime(startHour)) return 'Hora de inicio';
    if(finishHour && !checkTime(finishHour)) return 'Hora de finalizacion';
    if(highlighted && !checkHighlighted(highlighted)) return 'Destacado';
    if(days && !checkDays(days)) return 'Dias'
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
    if(!name || !checkName(name)) return 'Nombre';
    if(!checkTransmissionDate(startTransmission, finishTransmission)) return 'fecha de transmision';
    if(!creatorId || !checkCreatorId(creatorId)) return 'Id del creador';
    if(!creatorName || !checkCreatorName(creatorName)) return 'Nombre del creador'
    return true;
}

const checkUpdateSpecialTransmission = ({ name, startTransmission, finishTransmission, active, transmissionId }) => {
    if(name && !checkName(name)) return 'Nombre';
    if((startTransmission || finishTransmission) && !checkTransmissionDate(startTransmission, finishTransmission)) return 'fecha de transmision';
    if((startTransmission  || !finishTransmission) && (!startTransmission || finishTransmission) && checkTransmissionDate(startTransmission,finishTransmission))
    if(active && !checkBoolean(active)) return 'activo'
    if(!transmissionId || !checkId(transmissionId)) return 'Id de transmision';
    return true;
}

const checkNewPublicityData = ({ name, type }) => {
    if(!name || !checkName(name)) return 'Nombre';
    if(!type || !checkTypePublicity(type)) return 'Tipo';
    return true;
}


module.exports = {
    checkUserData,
    checkNewProgramData,
    checkUpdateProgramData,
    checkNewSpecialTransmission,
    checkUpdateSpecialTransmission,
    checkNewPublicityData,
}