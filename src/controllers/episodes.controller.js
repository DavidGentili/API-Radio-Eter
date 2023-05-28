const mongoose = require('mongoose');
const { checkNewEpisodeData, checkUpdateEpisodeData } = require('../helpers/checkData/checkEpisode');
const { getQueryParams } = require('../helpers/formatData');
const { formatObjectResponse } = require('../helpers/formatData');
const { createElement, deleteElement, getElementById, getElements, updateElement } = require('./element.controller');
const Episode = require('../models/Episode');

async function getEpisodes(query) {
    const queryParams = getQueryParams(query);
    return await getElements(queryParams, Episode);
}


async function getEpisodeById(id) {
    return await getElementById(id, Episode);
}

async function getEpisodesByColleciontOfIds(ids) {
    try {
        const episodes = await Episode.find({
            _id: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) }
        }).lean()
        const formatResponse = Array.isArray(episodes) ? episodes.map(episode => formatObjectResponse(episode)) : [formatObjectResponse(episodes)];
        return formatResponse;
    } catch (e) {
        console.log(e)
        throw { code: 400, response: { message: 'Error al consultar el episodio ' } };
    }
}

async function getLatestEpisode(cant) {
    try {
        const episodes = await getElements({}, Episode);
        episodes.sort((a, b) => {
            return b.createdAt - a.createdAt;
        })
        const res = [];
        for (let i = 0; i < cant; i++)
            if (episodes[0])
                res.push(episodes.shift());
        return res;

    } catch (e) {
        throw { code: 400, response: { message: 'Error al consultar el episodio ' } };
    }
}
async function createEpisode(episodeData) {
    const check = checkNewEpisodeData(episodeData);
    if (check !== true)
        throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
    try {
        return await createElement(episodeData, Episode);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al crear el episodio ' } };
    }
}

async function updateEpisode(id, episodeData) {
    const check = checkUpdateEpisodeData(episodeData);
    if (check !== true)
        throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
    try {
        return await updateElement(episodeData, id, Episode);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al crear el episodio ' } };
    }
}

async function deleteEpisode(id) {
    try {
        return await deleteElement(id, Episode);
    } catch (e) {
        throw { code: 400, response: { message: 'Error al eliminar el episodio ' } };
    }
}

module.exports = {
    getEpisodes,
    getEpisodeById,
    getEpisodesByColleciontOfIds,
    getLatestEpisode,
    createEpisode,
    updateEpisode,
    deleteEpisode,
}