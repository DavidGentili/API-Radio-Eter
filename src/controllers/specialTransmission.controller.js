const SpecialTransmission = require('../models/SpecialTransmission');
const { checkNewSpecialTransmission, checkUpdateSpecialTransmission } = require('../helpers/checkData/checkSpecialTransmission');
const { getQueryParams, getFormatParameters } = require('../helpers/formatData');
const { getElements, getElementById, createElement, updateElement, deleteElement } = require('./element.controller');

const getTransmissions = async (transmissionData) => {
    const queryParams = getQueryParams(transmissionData, ['active', 'name']);
    return await getElements(queryParams, SpecialTransmission);
}

const getTransmissionsById = async (transmissionId) => {
    return await getElementById(transmissionId, SpecialTransmission);
} 

const createSpecialTransmission = async (transmissionData) => {
    const check = checkNewSpecialTransmission(transmissionData);
    if(check !== true)
        throw { code : 400, response : { message : `Se ha ingresado un ${check} incorrecto`}}
    try{
        await createElement(transmissionData, SpecialTransmission);
        updateActiveTransmission()
        return { message : 'La transmision ha sido creada con exito'}
    }catch(e){
        throw { code : 400, response : { message : 'Error al crear la transmision especial '}};
    }
}

const updateActiveTransmission = async () => {
    const now = new Date(Date.now());
    const transmissions = await SpecialTransmission.find({active: true}).lean();
    transmissions.forEach( async (transmission) => {
        if(now > transmission.finishTransmission)
            await SpecialTransmission.findByIdAndUpdate(transmission._id, {active : false});
    })
}

const updateTransmission = async (transmissionData) => {
    const check = checkUpdateReportData(transmissionData);
    if(check !== true)
        throw { code : 400, response : { message : `Se ha ingresado un ${check} incorrecto`}}
    try{
        const { transmissionId } = transmissionData;
        const updateData = getFormatParameters(transmissionData, ['name', 'startTransmission', 'finishTransmission', 'active',]);
        await updateElement(updateData, transmissionId, SpecialTransmission);
        updateActiveTransmission()
        return { message : 'La transmision se ha actualizado con exito'};  
    } catch(e){
        throw { code : 400, response : { message : 'Error al actualizar la transmision '}};
    }
}

const deleteTransmission = async(transmissionId) => {
    try{
        await deleteElement(transmissionId, SpecialTransmission);
        return { message : 'La transmision se ha eliminado con exito'};
    }catch(e){
        throw { code : 400, response : { message : 'Error al eliminar la transmision '}};
    }
}

module.exports = { 
    getTransmissions, 
    createSpecialTransmission, 
    updateTransmission,
    deleteTransmission
}