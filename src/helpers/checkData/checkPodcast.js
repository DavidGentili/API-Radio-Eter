const { isArray, isBoolean, isString } =  require("../checkTypes");
const { checkName, checkParameters } = require("./checkData");

const checkTags = (tags) => (isArray(tags) && tags.every(tag => isArray(tag)));

const checkUrl = (urls) => typeof urls === 'Object';

const podcastKeys = [
    'title',
    'description',
    'tags',
    'urls',
    'imgUrl',
    'active',
]


function checkNewPodcastData(podcastData) {
    const { title, description, tags, urls, imgUrl, active } = podcastData;
    if(!checkParameters(podcastData, podcastKeys)) return 'parametros';
    if(!title || !checkName(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(tags && !checkTags) return 'Etiquetas';
    if(urls && !checkUrl) return 'Links';
    if(imgUrl && !isArray(imgUrl)) return 'Imagen';
    if(active && !isBoolean(active)) return 'activo'
    return true;
}


function checkUpdatePodcastData(podcastData) {
    const { title, description, tags, urls, imgUrl, active } = podcastData;
    if(title && !checkName(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(tags && !checkTags) return 'Etiquetas';
    if(urls && !checkUrl) return 'Links';
    if(imgUrl && !isArray(imgUrl)) return 'Imagen';
    if(active && !isBoolean(active)) return 'activo'
    return true
}


module.exports = {
    checkNewPodcastData,
    checkUpdatePodcastData,
}