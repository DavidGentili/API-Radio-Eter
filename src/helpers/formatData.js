const { isString } = require('./checkTypes');

/**
 * Retorna un objeto los valores de las keys indicadas, solo si estos valores existen
 * @param {*} object : Objeto base
 * @param {*} keys : lista de keys
 * @returns objeto con los valores correspondientes a las keys indicadas
 */
const getFormatParameters = (object, keys) => {
    const aux = {};
    if(Array.isArray(keys)){
        keys.forEach(key => {
            if(typeof(object[key]) !== 'undefined' && typeof(object[key] !== 'null'))
                aux[key] = object[key];
        })
    }
    return aux;
}

const getQueryParams = (object) => {
    const queryParams = {};
    const keys = Object.keys(object);
    keys.forEach(key =>{
        if(typeof(object[key]) !== 'undefined' && typeof(object[key]) !== 'null')
            queryParams[key] = object[key];
    });
    return queryParams;
}

const formatObjectResponse = (object) => {
    if(!object)
        return undefined;
    const keys = Object.keys(object);
    const exceptions = ['_id', 'password', '__v'];
    const newObject = {};
    newObject.id = object.id || object._id.toString();
    keys.forEach(key => {
        if(!exceptions.includes(key))
            newObject[key] = object[key];
    })
    return newObject;
}

const dataToLowerCase = (userData, keys) => {
    keys.forEach(key => {
        if(userData[key] && isString(userData[key]))
            userData[key] = userData[key].toLowerCase();
    })
}

module.exports = { 
    getFormatParameters,
    formatObjectResponse,
    getQueryParams,
    dataToLowerCase,
}