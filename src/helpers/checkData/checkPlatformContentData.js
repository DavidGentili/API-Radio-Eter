const { checkName, checkParameters } = require('./checkData');
const { isString } = require('../checkTypes');

const platformContentKeys = [ 
    'name', 
    'type',
    'contents',
]

function checkTypePlatformContent(type) {
    return isString(type) && (type.toLowerCase() === 'carrousel' || type.toLowerCase() === 'list');
}

function checkContent(content) {
    const { title, src, order, link, active } = content;
    if(!title || !checkName(title)) return 'Titulo';
    if(!src || !isString(src)) return 'Src';
    if(order && !isNumber(order)) return 'Orden';
    if(link && !isString(link)) return 'Link';
    if(active !== undefined && !Boolean(active)) return 'Activo';
    return true;
}


const checkNewPlatformContentData = (platformContentData) => {

    const { name, type, contents } = platformContentData;
    if(!checkParameters(platformContentData, platformContentKeys)) return 'parametro';
    if(!name || !checkName(name)) {return 'Nombre'};
    if(!type || !checkTypePlatformContent(type)) return 'Tipo';
    if(contents && !isArray(contents)) return 'Contenidos';
    if(contents && !contents.every(checkContent)) return 'Contenidos';
    return true;
}

const checkUpdatePlatformContentData = (platformContentData) => {
    const { name, type, contents } = platformContentData;
    if(name && !checkName(name)) {return 'Nombre'};
    if(type && !checkTypePlatformContent(type)) return 'Tipo';
    if(contents && !isArray(contents)) return 'Contenidos';
    if(contents && !contents.every(checkContent)) return 'Contenidos';
    return true;
}



module.exports = {
    checkNewPlatformContentData,
    checkUpdatePlatformContentData,
    checkContent
}