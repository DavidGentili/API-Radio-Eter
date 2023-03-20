const { isArray, isNumber, isString } =  require("../checkTypes");
const { checkName, checkParameters } = require("./checkData");

const checkTags = (tags) => (isArray(tags) && tags.every(tag => isArray(tag)));

const checkUrl = (urls) => typeof urls === 'Object';

const episodeKeys = [
    'title',
    'description',
    'tags',
    'urls',
    'imgUrl',
    'order',
    'active',
]


function checkNewEpisodeData(episodeData) {
    const { title, description, tags, urls, imgUrl, order, active } = episodeData;
    if(!checkParameters(episodeData, episodeKeys)) return 'parametros';
    if(!title || !checkName(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(tags && !checkTags) return 'Etiquetas';
    if(urls && !checkUrl) return 'Links';
    if(imgUrl && !isArray(imgUrl)) return 'Imagen';
    if(order === undefined || !isNumber(order)) return 'Orden';
    if(active !== undefined && !Boolean(active)) return 'Activo';

    return true;
}

function checkUpdateEpisodeData(episodeData) {
    const { title, description, tags, urls, imgUrl, order } = episodeData;
    if(title && !checkName(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(tags && !checkTags) return 'Etiquetas';
    if(urls && !checkUrl) return 'Links';
    if(imgUrl && !isArray(imgUrl)) return 'Imagen';
    if(order && !isNumber(order)) return 'Orden';
    return true;
}

module.exports = {
    checkNewEpisodeData,
    checkUpdateEpisodeData
}