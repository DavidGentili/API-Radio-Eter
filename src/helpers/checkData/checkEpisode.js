import { isArray, isNumber, isString } from "../checkTypes";
import { checkName, checkParameters } from "./checkData";

const checkTags = (tags) => (isArray(tags) && tags.every(tag => isArray(tag)));

const checkUrl = (urls) => typeof urls === 'Object';

const episodeKeys = [
    'title',
    'description',
    'tags',
    'urls',
    'imgUrl',
    'order',
]


export function checkNewEpisodeData(episodeData) {
    const { title, description, tags, urls, imgUrl, order } = episodeData;
    if(!checkParameters(episodeData, episodeKeys)) return 'parametros';
    if(!title || !checkName(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(tags && !checkTags) return 'Etiquetas';
    if(urls && !checkUrl) return 'Links';
    if(imgUrl && !isArray(imgUrl)) return 'Imagen';
    if(!order || !isNumber(order)) return 'Orden';
}

export function checkUpdateEpisodeData(episodeData) {
    if(title && !checkName(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(tags && !checkTags) return 'Etiquetas';
    if(urls && !checkUrl) return 'Links';
    if(imgUrl && !isArray(imgUrl)) return 'Imagen';
    if(order && !isNumber(order)) return 'Orden';
}