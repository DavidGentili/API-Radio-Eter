import { checkUpdateEpisodeData } from '../helpers/checkData/checkEpisode';
import { checkNewPodcastData } from '../helpers/checkData/checkPodcast';
import { getQueryParams } from '../helpers/formatData';
import {
    createElement,
    getElementById,
    getElements,
    updateElement
} from './element.controller';
import { createEpisode, deleteEpisode, getEpisodesByColleciontOfIds } from './episodes.controller';

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
        throw { code: 400, response: { message: 'Error al crear el podcast ' } };
    }
}

export async function updatePodcast(podcastdata, id) {
    const check = checkUpdateEpisodeData(podcastdata);
    if (check !== true)
        throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
    try {
        return await updateElement(podcastData, id, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al actualizar el podcast ' } };
    }
}

export async function deletePodcast(id) {
    try {
        return await deleteElement(id, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al eliminar el podcast ' } };
    }
}

export async function addEpisode(podcastId, episodeData) {
    try {
        const podcast = await getPodcastById(podcastId);
        if (!podcast)
            throw 'No existe el podcast ingresado';
        const episode = await createEpisode(episodeData);
        const { id } = episode;
        const updatedData = { episodesId: [...podcast.episodesId, id] };
        return await updateElement(updatedData, id, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al agregar el programa al podcast' } };
    }
}

export async function removeEpisode(podcastId, episodeId) {
    try {
        const podcast = await getPodcastById(podcastId);
        if (!podcast)
            throw 'No existe el podcast ingresado';
        await deleteEpisode(episodeId);
        const updatedData = podcast.episodesId.filter(episode => episode !== episodeId);
        return await updateElement(updatedData, id, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al agregar el programa al podcast' } };
    }
}

export async function getEpisodesOfPodcast(podcastId) {
    try {
        const podcast = await getPodcastById(podcastId);
        if (!podcast)
            throw 'No existe el podcast ingresado';
        const episodes = await getEpisodesByColleciontOfIds(podcast.episodesId);
        return episodes;
    } catch (e) {
        throw { code: 400, response: { message: 'Error al agregar el programa al podcast' } };
    }
}
