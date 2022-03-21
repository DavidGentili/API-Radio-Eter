const securityLevels = require('../helpers/securityLvl');


//Se encargar de comprobar que la informacion para un signup sea correcta en ese caso retorna true
//caso contrario retorna retornar un string con el nombre del atributo incorrecto para retornar el error
const checkUserData = ({email, name, password, securityLevel}) => {
    const re = /^([\da-zA-Z_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
    if(securityLevel && !securityLevels.includes(securityLevel.toLowerCase()))
        return 'security level';
    if(!email || !re.exec(email))
        return 'email'
    if(!name || name.length < 4)
        return 'name'
    if(!password || password.length < 6)
        return 'password'
    return true;
}

module.exports = {
    checkUserData,
}