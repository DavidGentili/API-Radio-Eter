const Publicity = require('../models/Publicity');
const { getFormatParameters } = require('../helpers/formatData');
const { checkNewPublicityData, checkUpdatePublicityData } = require('../helpers/checkData/checkPublicity');
const { getElements, getElementById, createElement, updateElement, deleteElement } = require('./element.controller');


const getAd = async (publicityData) => {
    const queryParams = getQueryParams(publicityData,[ 'name', 'urlImage', 'altText', 'link', 'type',]);
    return await getElements(queryParams, Publicity);
}

const getAdById = async (adId) => {
    return await getElementById(adId, Publicity);
}

const createAd = async (adData) => {
    const check = checkNewPublicityData(adData);
    if(check !== true)
        throw { code : 400, response : { message : `Se ha ingresado un ${check} incorrecto`}}
    try{
        await createElement(adData, Publicity);
        return { message : 'El aviso ha sido creado con exito'}
    }catch(e){
        throw { code : 400, response : { message : 'Error al crear el aviso '}};
    }
}

const updateAd = async (adData) => {
    const check = checkUpdatePublicityData(adData);
    if(check !== true)
        throw { code : 400, response : { message : `Se ha ingresado un ${check} incorrecto`}}
    try{
        const { adId } = adData;
        const updateData = getFormatParameters(adData, [ 'name', 'urlImage', 'altText', 'link', 'type',]);
        await updateElement(updateData, adId, Publicity);
        return { message : 'El anuncio se ha actualizado con exito'};  
    } catch(e){
        throw { code : 400, response : { message : 'Error al actualizar el anuncio '}};
    }
}

const deleteAd = async(adId) => {
    try{
        await deleteElement(adId, Publicity);
        return { message : 'El anuncio se ha eliminado con exito'};
    }catch(e){
        throw { code : 400, response : { message : 'Error al eliminar el anuncio '}};
    }

}

module.exports = { 
    getAd,
    getAdById,
    createAd, 
    updateAd, 
    deleteAd, 
 }