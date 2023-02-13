const Report = require('../models/Report');
const { checkNewReportData, checkUpdateReportData } = require('../helpers/checkData/checkReport');
const { getQueryParams, getFormatParameters } = require('../helpers/formatData');
const { getElements, getElementById, createElement, updateElement, deleteElement } = require('./element.controller');


const getReport = async (reportData) => {
    const queryParams = getQueryParams(reportData, ['id','title', 'active','creatorId','creatorName', 'tags']);
    return await getElements(queryParams, Report);
}

const getReportById = async (reportId) => {
    return await getElementById(reportId, Report);
}

const createReport = async (reportData) => {
    reportData.lastModify = new Date(Date.now());
    const check = checkNewReportData(reportData);
    if(check !== true)
        throw { code : 400, response : { message : `Se ha ingresado un ${check} incorrecto`}}
    try{
        await createElement(reportData, Report);
        return { message : 'El reporte ha sido creado con exito'}
    }catch(e){
        throw { code : 400, response : { message : 'Error al crear el reporte '}};
    }
}

const updateReport = async (reportData) => {
    reportData.lastModify = new Date(Date.now());
    const check = checkUpdateReportData(reportData);
    if(check !== true)
        throw { code : 400, response : { message : `Se ha ingresado un ${check} incorrecto`}}
    try{
        const { reportId } = reportData;
        const updateData = getFormatParameters(reportData, ['title', 'description', 'content', 'active', 'mainMediaUrl', 'lastModify', 'tags']);
        await updateElement(updateData, reportId, Report);
        return { message : 'El reporte se ha actualizado con exito'};  
    } catch(e){
        throw { code : 400, response : { message : 'Error al actualizar el reporte '}};
    }
}

const deleteReport = async(reportId) => {
    try{
        await deleteElement(reportId, Report);
        return { message : 'El reporte se ha eliminado con exito'};
    }catch(e){
        throw { code : 400, response : { message : 'Error al eliminar el reporte '}};
    }
}

module.exports = { 
    getReport,
    getReportById,
    createReport,
    updateReport,
    deleteReport,
}
