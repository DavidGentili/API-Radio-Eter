const { checkNewPodcastData, checkUpdatePodcastData } = require('../helpers/checkData/checkPodcast');
const { getQueryParams } = require('../helpers/formatData');
const {
    createElement,
    getElementById,
    getElements,
    updateElement,
    deleteElement,
} = require('./element.controller');
const { createEpisode, deleteEpisode, getEpisodesByColleciontOfIds } = require('./episodes.controller');

const Podcast = require('../models/Podcast');

const getPodcast= async (query) => {
    const queryParams = getQueryParams(query);
    return await getElements(queryParams, Podcast);
}

async function getPodcastById(id) {
    return await getElementById(id, Podcast);
}

async function createPodcast(podcastData) {
    const check = checkNewPodcastData(podcastData);
    if (check !== true)
        throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
    try {
        return await createElement(podcastData, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al crear el podcast ' } };
    }
}

async function updatePodcast(podcastdata, id) {
    const check = checkUpdatePodcastData(podcastdata);
    if (check !== true)
        throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
    try {
        return await updateElement(podcastdata, id, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al actualizar el podcast ' } };
    }
}

async function deletePodcast(id) {
    try {
        return await deleteElement(id, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al eliminar el podcast ' } };
    }
}

async function addEpisode(podcastId, episodeData) {
    try {
        const podcast = await getPodcastById(podcastId);
        if (!podcast)
            throw 'No existe el podcast ingresado';
        if(!episodeData.order)
            episodeData.order = podcast.episodesId.length;
        const episode = await createEpisode(episodeData);
        const { id } = podcast;
        const updatedData = { episodesId: [...podcast.episodesId, episode.id] };
        return await updateElement(updatedData, id, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al agregar el programa al podcast' } };
    }
}

async function removeEpisode(podcastId, episodeId) {
    try {
        const podcast = await getPodcastById(podcastId);
        if (!podcast)
            throw 'No existe el podcast ingresado';
        await deleteEpisode(episodeId);
        const updatedData = podcast.episodesId.filter(episode => episode !== episodeId);
        return await updateElement(updatedData, podcast.id, Podcast);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al eliminar el programa del podcast' } };
    }
}

async function getEpisodesOfPodcast(podcastId) {
    try {
        const podcast = await getPodcastById(podcastId);
        if (!podcast)
            throw 'No existe el podcast ingresado';
        const episodes = await getEpisodesByColleciontOfIds(podcast.episodesId);
        return episodes;
    } catch (e) {
        throw { code: 400, response: { message: 'Error al buscar los programas del podcast' } };
    }
}

async function getEpisodesWithPodcast() {
    try{
        const podcasts = await getPodcast({});
        const episodes = [];
        for(const podcast of podcasts){
            const auxEp = await getEpisodesByColleciontOfIds(podcast.episodesId);
            const aux = auxEp.map(ep => ({...ep, podcastTitle : podcast.title, podcastId : podcast.id}));
            episodes.push(...aux);
        }
        return episodes;
    } catch(e) {
        console.log(e)
        throw { code: 400, response: { message: 'Error al consultar el episodio ' } };
    }
}


module.exports = {
    getPodcast,
    getPodcastById,
    createPodcast,
    updatePodcast,
    deletePodcast,
    addEpisode,
    removeEpisode,
    getEpisodesOfPodcast,
    getEpisodesWithPodcast,
}