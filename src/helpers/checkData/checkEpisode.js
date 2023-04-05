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
    'active',
]


function checkNewEpisodeData(episodeData) {
    const { title, description, tags, urls, imgUrl, active } = episodeData;
    if(!checkParameters(episodeData, episodeKeys)) return 'parametros';
    if(!title || !checkName(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(tags && !checkTags) return 'Etiquetas';
    if(urls && !checkUrl) return 'Links';
    if(imgUrl && !isString(imgUrl)) return 'Imagen';
    if(active !== undefined && !Boolean(active)) return 'Activo';

    return true;
}

function checkUpdateEpisodeData(episodeData) {
    const { title, description, tags, urls, imgUrl } = episodeData;
    if(title && !checkName(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(tags && !checkTags) return 'Etiquetas';
    if(urls && !checkUrl) return 'Links';
    if(imgUrl && !isString(imgUrl)) return 'Imagen';
    return true;
}

module.exports = {
    checkNewEpisodeData,
    checkUpdateEpisodeData
}