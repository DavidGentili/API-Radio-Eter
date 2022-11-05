const { checkName, checkParameters } = require('./checkData');

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
    const { name, type } = publicityData;
    if(!checkParameters(publicityData, publicityKeys)) return 'parametro';
    if(!name || !checkNameOrTitle(name)) {return 'Nombre'};
    if(!type || !checkTypePublicity(type)) return 'Tipo';
    return true;
}

module.exports = {
    checkNewPublicityData,
}