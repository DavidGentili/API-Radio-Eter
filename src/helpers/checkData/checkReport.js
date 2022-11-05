const { isString, isBoolean } = require('../checkTypes');
const { checkTitle, checkParameters } = require('./checkData');

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
    const { title, description, content, active, mainMediaUrl, creatorId, creatorName } = reportData;
    if(!checkParameters(reportData, reportKeys)) return 'parametro';
    if(!title || !checkTitle(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(!content || !isString(content)) return 'Contenido Principal';
    if(!active || !isBoolean(active)) return 'Activo';
    if(mainMediaUrl && !isString(mainMediaUrl)) return 'Imagen principal';
    if(!creatorId || !checkCreatorId(creatorId)) return 'Id del creador';
    if(!creatorName || !checkNameOrTitle(creatorName)) return 'nombre del creador';
    return true;
}

const checkUpdateReportData = () => {
    const {
        title,
        description,
        content,
        active,
        mainMediaUrl,
    } = reportData;
    if(title && !checkTitle(title)) return 'Titulo';
    if(description && !isString(description)) return 'Descripcion';
    if(content && !isString(content)) return 'Contenido Principal';
    if(active && !isBoolean(active)) return 'Activo';
    if(mainMediaUrl && !isString(mainMediaUrl)) return 'Imagen principal';
    return true;
}

module.exports = {
    checkNewReportData,
    checkUpdateReportData,
}
