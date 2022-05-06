const securityLevels = require('../helpers/securityLvl');


//Se encargar de comprobar que la informacion para un signup sea correcta en ese caso retorna true
//caso contrario retorna retornar un string con el nombre del atributo incorrecto para retornar el error
const checkUserData = ({email, name, securityLevel}) => {
    const re = /^([\da-zA-Z_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
    if(!securityLevel || typeof(securityLevel) !== 'string' || !securityLevels.includes(securityLevel.toLowerCase())) return 'security level';
    if(!email || typeof(email) !== 'string' || !re.exec(email)) return 'email'
    if(!name || typeof(name) !== 'string' ||name.length < 4) return 'name'
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
const checkProgramData = ({name, startHour,finishHour, highlighted, days}) => {
    if(!name || typeof(name) !== 'string' || name.length < 4) return 'name';
    if(!startHour || !checkTime(startHour)) return 'start hour';
    if(!finishHour || !checkTime(finishHour)) return 'finish hour';
    if(!highlighted || typeof(highlighted) !== 'boolean') return 'highlighted';
    if(!days || !Array.isArray(days) || !days.every(day => typeof(day) === 'boolean') || days.length !== 7) return 'days'
    return true; 
}

module.exports = {
    checkUserData,
    checkProgramData,
}