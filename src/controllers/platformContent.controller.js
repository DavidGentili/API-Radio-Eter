const { createElement, deleteElement, getElementById, getElements, updateElement } = require('./element.controller');
const { getQueryParams } = require('../helpers/formatData');
const PlatformContent = require('../models/PlatformContent');
const { checkNewPlatformContentData, checkUpdatePlatformContentData, checkContent } = require('../helpers/checkData/checkPlatformContentData');



async function getPlatformContent(query) {
    try {
        const queryParams = getQueryParams(query);
        return await getElements(queryParams, PlatformContent);
    } catch (e) {
        throw { code: 500, response: { message: 'Error al consultar el contenido de la plataforma ' } };
    }
}

async function getPlatformContentById(id) {
    try {
        return await getElementById(id, PlatformContent);
    } catch (e) {
        throw { code: 500, response: { message: 'Error al consultar el contenido de la plataforma ' } };
    }
}

async function getPlatformContentByName(name) {
    try {
        const platformContent = await getElements({ name }, PlatformContent);
        return platformContent?.pop() || null;
    } catch (e) {
        throw { code: 500, response: { message: 'Error al consultar el contenido de la plataforma ' } };
    }
}

async function createPlatformContent(data) {
    try {
        const check = checkNewPlatformContentData(data);
        if (check !== true)
            throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
        return await createElement(data, PlatformContent);
    } catch (e) {
        console.log(e);
        throw { code: 500, response: { message: 'Error al crear el contenido de la plataforma ' } };
    }
}

async function updatePlatformContent(id, data) {
    try {
        const check = checkUpdatePlatformContentData(data);
        if (check !== true)
            throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
        return await updateElement(data, id, PlatformContent);
    } catch (e) {
        throw { code: 500, response: { message: 'Error al actualizar el contenido de la plataforma ' } };
    }
}

async function deletePlatformContent(id) {
    try {
        return await deleteElement(id, PlatformContent);
    } catch (e) {
        throw { code: 500, response: { message: 'Error al eliminar el contenido de la plataforma ' } };
    }
}

async function addContent(id, data) {
    try {
        const check = checkContent(data);
        if (check !== true)
            throw { code: 400, response: { message: `Se ha ingresado un ${check} incorrecto` } }
        const platformContent = await getPlatformContentById(id);
        if (!platformContent)
            throw { code: 400, response: { message: 'Contenido de plataforma no encontrado' } }
        const { contents } = platformContent;
        const newContents = addContentToPlatformContent([...contents], data);
        const updateData = { contents: newContents };
        return await updateElement(updateData, id, PlatformContent);
    } catch (e) {
        console.log(e);
        throw { code: 500, response: { message: 'Error al agregar el contenido a la plataforma ' } };
    }
}

async function removeContent(id, contentId) {
    try {
        const platformContent = await getPlatformContentById(id);
        if (!platformContent)
            throw { code: 400, response: { message: 'Contenido de plataforma no encontrado' } }
        const newContents = platformContent.contents.filter(content => content._id.toString() !== contentId);
        const updateData = { contents: newContents };
        return await updateElement(updateData, id, PlatformContent);
    } catch (e) {
        throw { code: 500, response: { message: 'Error al eliminar el contenido de la plataforma ' } };
    }
}


function addContentToPlatformContent(contents, content) {
    const order = contents.reduce((acc, curr) => acc < curr.order ? curr.order : acc, -1) + 1
    contents.push({
        ...content,
        order,
        active: true,
    })
    return contents;
}

module.exports = {
    getPlatformContent,
    getPlatformContentById,
    getPlatformContentByName,
    createPlatformContent,
    updatePlatformContent,
    deletePlatformContent,
    addContent,
    removeContent,
}