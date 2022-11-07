const { checkName, checkParameters } = require('./checkData');
const { isString } = require('../checkTypes');

const publicityKeys = [ 
    'name', 
    'urlImage', 
    'altText', 
    'link',
    'type',
    'createdAt',
    'creatorId',
    'creatorName',
]


const checkTypePublicity = (type) => ( isString(type) && (type.toLowerCase() === 'oficial' || type.toLowerCase() === 'standard') )


const checkNewPublicityData = (publicityData) => {
    const { name, type, urlImage, altText, link, } = publicityData;
    if(!checkParameters(publicityData, publicityKeys)) return 'parametro';
    if(!name || !checkName(name)) {return 'Nombre'};
    if(!type || !checkTypePublicity(type)) return 'Tipo';
    if(urlImage && !isString(urlImage)) return 'Url de la imagen';
    if(link && !isString(link)) return 'Link';
    if(altText && !isString(altText)) return 'texto alternativo '
    return true;
}

const checkUpdatePublicityData = (publicityData) => {
    const { name, type, urlImage, altText, link, } = publicityData;
    if(name && !checkName(name)) {return 'Nombre'};
    if(type && !checkTypePublicity(type)) return 'Tipo';
    if(urlImage && !isString(urlImage)) return 'Url de la imagen';
    if(link && !isString(link)) return 'Link';
    if(altText && !isString(altText)) return 'texto alternativo '
    return true;
}

module.exports = {
    checkNewPublicityData,
    checkUpdatePublicityData,
}