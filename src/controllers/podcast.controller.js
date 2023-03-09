import { checkUpdateEpisodeData } from '../helpers/checkData/checkEpisode';
import { checkNewPodcastData } from '../helpers/checkData/checkPodcast';
import { getQueryParams } from '../helpers/formatData';
import { 
    createElement, 
    getElementById, 
    getElements, 
    updateElement 
} from './element.controller';

const Podcast = require('../models/Podcast');

export async function getPodcast(query) {
    const queryParams = getQueryParams(query);
    return await getElements(queryParams, Podcast);
}

export async function getPodcastById(id) {
    return await getElementById(id, Podcast);
}

export async function createPodcast(podcastData) {
    const check = checkNewPodcastData(podcastData);
    if (check !== true)
        throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
    try {
        return await createElement(podcastData, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al crear el programa ' } };
    }
}

export async function updatePodcast(podcastdata, id) {
    const check = checkUpdateEpisodeData(podcastdata);
    if (check !== true)
        throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
    try {
        return await updateElement(podcastData, id, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al crear el programa ' } };
    }
}

export async function deletePodcast(id) {
    try{
        return await deleteElement(id, Podcast);
    }catch(e){
        throw { code : 400, response : { message : 'Error al eliminar el programa '}};
    }
}
