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

const getPodcast = async (query) => {
    const queryParams = getQueryParams(query);
    return await getElements(queryParams, Podcast);
}

async function getPodcastById(id) {
    return await getElementById(id, Podcast);
}

async function getLatestPodcast() {
    const podcast = await getPodcast({});
    return podcast.reverse().slice(0, 3);
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
        const episode = await createEpisode(episodeData);
        const { id } = podcast;
        const order = podcast.episodesId.length;
        const newEpisode = {
            episodeId: episode.id,
            order,
        }
        const updatedData = { episodesId: [...podcast.episodesId, newEpisode] };
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
        const updatedData = podcast.episodesId.filter(ep => ep.episodeId !== episodeId);
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
        const ids = podcast.episodesId.map(ep => ep.episodeId);
        const episodes = await getEpisodesByColleciontOfIds(ids);
        const res = episodes.map(ep => {
            const auxEp = podcast.episodesId.find(episode => episode.episodeId === ep.id);
            return auxEp ? { ...ep, order: auxEp.order } : ep;
        })
        return res;
    } catch (e) {
        throw { code: 400, response: { message: 'Error al buscar los programas del podcast' } };
    }
}

async function getEpisodesWithPodcast() {
    try {
        const podcasts = await getPodcast({});
        const episodes = [];
        for (const podcast of podcasts) {
            const ids = podcast.episodesId.map(ep => ep.episodeId);
            const auxEp = await getEpisodesByColleciontOfIds(ids);
            const aux = auxEp.map(ep => ({ ...ep, podcastTitle: podcast.title, podcastId: podcast.id }));
            episodes.push(...aux);
        }
        return episodes;
    } catch (e) {
        console.log(e)
        throw { code: 400, response: { message: 'Error al consultar el episodio ' } };
    }
}

async function getLatestEpisodesWithPodcast(size = 3) {
    try {
        const episodes = await getEpisodesWithPodcast();
        episodes.sort((a, b) => {
            return b.createdAt - a.createdAt;
        })
        const res = [];
        for (let i = 0; i < size; i++)
            if (episodes[0])
                res.push(episodes.shift());
        return res;
    } catch (e) {
        console.log(e)
        throw { code: 400, response: { message: 'Error al consultar el episodio ' } };
    }
}

async function getPodcastWithEpisodes(podcastId) {
    try {
        const podcast = await getPodcastById(podcastId);
        if (!podcast)
            throw { code: 400, response: { message: 'Error, el podcast solicitado no existe' } }
        const episodes = await getEpisodesOfPodcast(podcastId);
        const { id, title, description, tags, urls, imgUrl, active } = podcast;
        return {
            id, title, description, tags, urls, imgUrl, active,
            episodes
        };
    } catch (e) {
        throw { code: 400, response: { message: 'Error al consultar el podcast ' } };
    }
}



module.exports = {
    getPodcast,
    getPodcastById,
    getLatestPodcast,
    createPodcast,
    updatePodcast,
    deletePodcast,
    addEpisode,
    removeEpisode,
    getEpisodesOfPodcast,
    getEpisodesWithPodcast,
    getLatestEpisodesWithPodcast,
    getPodcastWithEpisodes
}