const { securityLevels } = require('../securityLvl');
const { isArray, isString, isNumber, isBoolean } = require('../checkTypes');

/**
 *  retorna si existe una key en el objeto que no corresponda
 * @param {*} object objeto a comprobar
 * @param {Array} array array con las keys correspondientes
 * @returns true si los parametros entran en las keys denominadas
 */
const checkParameters = (object, array) => !(Object.keys(object).some(key => array.includes(key)));

const checkName = (name) => (isString(name) && name.length >= 4);

const checkTitle = (name) => (isString(name) && name.length >= 4);

const checkCreatorId = (creatorId) => (isString(creatorId) && creatorId.length === 24); 

const checkDays = (days) => (isArray(days) && days.every(day => isBoolean(day)) && days.length === 7)

const checkSecurityLevel = (securityLevel) => ( isString(securityLevel) && securityLevels.includes(securityLevel.toLowerCase()) );

const checkId = (id) => (isString(id) && id.length === 24);

const checkEmail = (email) => {
    const re = /^([\da-zA-Z_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
    return (isString(email) && re.exec(email));
}

const checkTime = (time) => {
    if(!time || typeof(time) !== 'string') return false;
    const [hours,minutes] = time.split(':');
    return hours !== ''
  	&& minutes !==''
  	&&((Number(hours) >= 0 && Number(hours) <= 24) 
    && (Number(minutes) >= 0 && Number(minutes) <= 60)) ? true : false
}
    
const checkUserData = ({email, name, securityLevel}) => {
    if(!securityLevel || !checkSecurityLevel(securityLevel)) return 'Nivel de seguridad';
    if(!email || !checkEmail(email)) return 'Mail'
    if(!name || !checkNameOrTitle) return 'Nombre'
    return true;
}

const checkNewReportData = (reportData) => {
    const { title, description, content, active, mainMediaUrl, creatorId, creatorName } = reportData;
    if(!title || !checkNameOrTitle(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(!content || !isString(content)) return 'Contenido Principal';
    if(!active || !isBoolean(active)) return 'Activo';
    if(mainMediaUrl && !isString(mainMediaUrl)) return 'Imagen principal';
    if(!creatorId || !checkCreatorId(creatorId)) return 'Id del creador';
    if(!creatorName || !checkNameOrTitle(creatorName)) return 'nombre del creador';
}



module.exports = {
    checkUserData,
    checkNewSpecialTransmission,
    checkUpdateSpecialTransmission,
    checkNewReportData,

    checkId,
    checkTitle,
    checkName,
    checkParameters,
    checkTime,
    checkDays,
    checkCreatorId,
}