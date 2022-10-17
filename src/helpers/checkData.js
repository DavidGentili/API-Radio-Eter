const { securityLevels } = require('../helpers/securityLvl');
const { isArray, isString, isNumber, isBoolean } = require('./checkTypes');

const checkNameOrTitle = (name) => (isString(name) && name.length >= 4)

const checkHighlighted = (highlighted) => isBoolean(highlighted);

const checkCreatorId = (creatorId) => (isString(creatorId) && creatorId.length === 24); 

const checkDays = (days) => (isArray(days) && days.every(day => isBoolean(day)) && days.length === 7)

const checkSecurityLevel = (securityLevel) => ( isString(securityLevel) && securityLevels.includes(securityLevel.toLowerCase()) );

const checkId = (id) => (isString(id) && id.length === 24);

const checkTypePublicity = (type) => ( isString(type) && (type.toLowerCase() === 'oficial' || type.toLowerCase() === 'standard') )

const checkMediaContent= (mediaContent) => (isArray(mediaContent) && mediaContent.every(media => isString(media)));

const checkEmail = (email) => {
    const re = /^([\da-zA-Z_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
    return (isString(email) && re.exec(email));
}
    

//Se encargar de comprobar que la informacion para un signup sea correcta en ese caso retorna true
//caso contrario retorna retornar un string con el nombre del atributo incorrecto para retornar el error
const checkUserData = ({email, name, securityLevel}) => {
    if(!securityLevel || !checkSecurityLevel(securityLevel)) return 'Nivel de seguridad';
    if(!email || !checkEmail(email)) return 'Mail'
    if(!name || !checkNameOrTitle) return 'Nombre'
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
const checkNewProgramData = ({name, startHour, finishHour, highlighted, days, creatorName, creatorId, urlImage}) => {
    if(!name || !checkNameOrTitle(name)) return 'Nombre';
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
    if(name && !checkNameOrTitle(name)) return 'Nombre';
    if(startHour && !checkTime(startHour)) return 'Hora de inicio';
    if(finishHour && !checkTime(finishHour)) return 'Hora de finalizacion';
    if(highlighted !== undefined && !checkHighlighted(highlighted)) return 'Destacado';
    if(urlImage && !isString(urlImage)) return 'Url de la imagen';
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
    if(!name || !checkNameOrTitle(name)) return 'Nombre';
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

const checkNewPublicityData = ({ name, type }) => {
    if(!name || !checkNameOrTitle(name)) {return 'Nombre'};
    if(!type || !checkTypePublicity(type)) return 'Tipo';
    return true;
}

const checkNewReportData = (reportData) => {
    const { title, description, content, mediaContent, mainImageUrl } = reportData;
    if(!title || !checkNameOrTitle(title)) return 'Titulo';
    if(description && !checkNameOrTitle(description)) return 'Descripcion';
    if(!content || !isString(content)) return 'Contenido Principal';
    if(mainImageUrl && !isString(mainImageUrl)) return 'Imagen principal';
    if(mediaContent && !checkMediaContent(mediaContent)) return 'Contenido multimedia';
}



module.exports = {
    checkUserData,
    checkNewProgramData,
    checkUpdateProgramData,
    checkNewSpecialTransmission,
    checkUpdateSpecialTransmission,
    checkNewPublicityData,
    checkNewReportData,
    checkId,
}