import { checkNewEpisodeData, checkUpdateEpisodeData } from '../helpers/checkData/checkEpisode';
import { getQueryParams } from '../helpers/formatData';
const { formatObjectResponse } = require('../helpers/formatData');
import { createElement, deleteElement, getElementById, getElements, updateElement } from './element.controller';
const Episode = require('../models/Episode');

export async function getEpisodes(query) {
    const queryParams = getQueryParams(query);
    return await getElements(queryParams, Episode);
}


export async function getEpisodeById(id) {
    return await getElementById(id, Episode);
}

export async function getEpisodesByColleciontOfIds(ids) {
    try{
        const episodes = await Episode.find({
            _id : { $in : ids.map(id => new mongoose.Types.ObjectId(id))}
        })
        const formatResponse = Array.isArray(episodes) ? episodes.map(episode => formatObjectResponse(episode)) : [formatObjectResponse(episodes)];
        return formatResponse;
    } catch(e) {
        throw { code: 400, response: { message: 'Error al consultar el programa ' } };
    }
}

export async function createEpisode(episodeData) {
    const check = checkNewEpisodeData(episodeData);
    if (check !== true)
        throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
    try {
        return await createElement(episodeData, Episode);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al crear el programa ' } };
    }
}

export async function updateEpisode(id, episodeData) {
    const check = checkUpdateEpisodeData(episodeData);
    if (check !== true)
        throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
    try {
        return await updateElement(episodeData, id, Episode);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al crear el programa ' } };
    }
}

export async function deleteEpisode(id) {
    try{
        return await deleteElement(id, Episode);
    }catch(e){
        throw { code : 400, response : { message : 'Error al eliminar el programa '}};
    }
}