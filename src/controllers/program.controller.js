const Program = require('../models/Program');
const { checkNewProgramData, checkUpdateProgramData } = require('../helpers/checkData/checkProgram')
const { getFormatParameters, formatObjectResponse } = require('../helpers/formatData');
const { getElements, getElementById, createElement, updateElement, deleteElement } = require('./element.controller');


const getProgramsByDay = async (day) => {
    const filter = {};
    filter[`days.${day}`] = true; 
    return await Program.find(filter).lean();
}

const getProgram = async (programData) => {
    const queryParams = getFormatParameters({highlighted, id}, ['highlighted', 'id']);
    return await getElements(queryParams, Program);
}

const getProgramById = async (programId) => {
    return await getElementById(reportId, Program);
}

const createProgram = async (programData) => {
    const check = checkNewProgramData(programData);
    if(check !== true)
        throw { code : 400, response : { message : `Se ha ingresado un ${check} incorrecto`}}
    try{
        await createElement(programData, Program);
        return { message : 'El programa ha sido creado con exito'}
    }catch(e){
        throw { code : 400, response : { message : 'Error al crear el programa '}};
    }

}

const updateProgram = async (programData) => {
    const check = checkUpdateProgramData(programData);
    if(check !== true)
        throw { code : 400, response : { message : `Se ha ingresado un ${check} incorrecto`}}
    try{
        const { programId } = programData;
        const updateData = getFormatParameters(programData, ['name', 'startHour', 'finishHour', 'highlighted', 'days', 'urlImage']);
        await updateElement(updateData, programId, Program);
        return { message : 'El programa se ha actualizado con exito'};
    } catch(e){
        throw { code : 400, response : { message : 'Error al actualizar el programa '}};
    }

}

const deleteProgram = async(programId) => {
    try{
        await deleteElement(programId, Program);
        return { message : 'El programa se ha eliminado con exito'};
    }catch(e){
        throw { code : 400, response : { message : 'Error al eliminar el programa '}};
    }

}


module.exports = { 
    getProgram, 
    getProgramById, 
    createProgram, 
    updateProgram, 
    deleteProgram, 
    getProgramsByDay 
}