const { checkName, checkParameters, checkId } = require('./checkData');
const { isString } = require('../checkTypes');
const { securityLevels } = require('../securityLvl')

const checkSecurityLevel = (securityLevel) => ( isString(securityLevel) && securityLevels.includes(securityLevel.toLowerCase()) );

const checkEmail = (email) => {
    const re = /^([\da-zA-Z_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
    return (isString(email) && re.exec(email));
}

const checkState = (state) => isString(state) && (state == 'active' || state == 'suspended')

const userKeys = [
    'name',
    'email',
    'securityLevel',
    'state'
]

const checkNewUserData = (userData) => {
    const {email, name, securityLevel, state} = userData;
    if(!checkParameters(userData, userKeys)) return 'Parametros';
    if(!securityLevel || !checkSecurityLevel(securityLevel)) return 'Nivel de seguridad';
    if(!email || !checkEmail(email)) return 'Mail';
    if(!name || !checkName(name)) return 'Nombre';
    if(!state || !checkState(state)) return 'Estado';
    return true;
}

const checkUpdateUserData = (userData) => {
    const {userId, id, email, name, securityLevel, state} = userData;
    if(securityLevel && !checkSecurityLevel(securityLevel)) return 'Nivel de seguridad';
    if(email && !checkEmail(email)) return 'Mail';
    if(name && !checkName(name)) return 'Nombre';
    if(state && !checkState(state)) return 'Estado';
    if(!userId || !checkId(userId) || !id || !checkId(id) || checkId === id) return 'Id del usuario' 
    return true;
}

module.exports = {
    checkNewUserData,
    checkUpdateUserData
}