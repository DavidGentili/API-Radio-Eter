const { isString, isBoolean, isDate } = require('../checkTypes');
const { checkTitle, checkParameters, checkCreatorId, checkName } = require('./checkData');

const reportKeys = [ 
    'title', 
    'description', 
    'content', 
    'active',
    'mainMediaUrl',
    'creatorId',
    'creatorName',
    'lastModify',
]

const checkNewReportData = (reportData) => {
    const { title, description, content, active, mainMediaUrl, creatorId, creatorName, lastModify } = reportData;
    if(!checkParameters(reportData, reportKeys)) return 'parametro';
    if(!title || !checkTitle(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(!content || !isString(content)) return 'Contenido Principal';
    if(!active || !isBoolean(active)) return 'Activo';
    if(mainMediaUrl && !isString(mainMediaUrl)) return 'Imagen principal';
    if(!creatorId || !checkCreatorId(creatorId)) return 'Id del creador';
    if(!creatorName || !checkName(creatorName)) return 'nombre del creador';
    if(!lastModify || !isDate(lastModify)) return 'reporte';
    return true;
}

const checkUpdateReportData = (reportData) => {
    const { title, description, content, active, mainMediaUrl, lastModify } = reportData;
    if(title && !checkTitle(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(content && !isString(content)) return 'Contenido Principal';
    if(active && !isBoolean(active)) return 'Activo';
    if(mainMediaUrl && !isString(mainMediaUrl)) return 'Imagen principal';
    if(!lastModify || !isDate(lastModify)) return 'Modificacion';
    return true;
}

module.exports = {
    checkNewReportData,
    checkUpdateReportData,
}
