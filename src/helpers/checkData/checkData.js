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

const checkId = (id) => (isString(id) && id.length === 24);

const checkTime = (time) => {
    if(!time || typeof(time) !== 'string') return false;
    const [hours,minutes] = time.split(':');
    return hours !== ''
  	&& minutes !==''
  	&&((Number(hours) >= 0 && Number(hours) <= 24) 
    && (Number(minutes) >= 0 && Number(minutes) <= 60)) ? true : false
}

module.exports = {
    checkId,
    checkTitle,
    checkName,
    checkParameters,
    checkTime,
    checkDays,
    checkCreatorId,
}