const { checkName, checkParameters } = require('./checkData');
const { isArray } = require('../checkTypes');

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
    if(!name || !checkNameOrTitle(name)) {return 'Nombre'};
    if(!type || !checkTypePublicity(type)) return 'Tipo';
    if(urlImage && !isArray(urlImage)) return 'Url de la imagen';
    if(link && !isArray(link)) return 'Link';
    if(altText && !isArray(altText)) return 'texto alternativo '
    return true;
}

const checkUpdatePublicityData = (publicityData) => {
    const { name, type, urlImage, altText, link, } = publicityData;
    if(name && !checkNameOrTitle(name)) {return 'Nombre'};
    if(type && !checkTypePublicity(type)) return 'Tipo';
    if(urlImage && !isArray(urlImage)) return 'Url de la imagen';
    if(link && !isArray(link)) return 'Link';
    if(altText && !isArray(altText)) return 'texto alternativo '
    return true;
}

module.exports = {
    checkNewPublicityData,
    checkUpdatePublicityData,
}