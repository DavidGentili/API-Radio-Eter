const StorageFile = require('../models/StorageFile');
const { createTmpImageFile, getNewFileName, removeFile } = require('../helpers/storage');
const { host } = require('../config');
const { checkNewFileData, checkDeleteFileData } = require('../helpers/checkData/checkFile');
const { getQueryParams } = require('../helpers/formatData');
const { getElements, getElementById, createElement } = require('./element.controller');


const getFiles = async (fileData) => {
    const queryParams = getQueryParams(fileData, ['id', 'name', 'urlName']);
    return await getElements(queryParams, StorageFile);
}

const getFilesById = async (fileId) => {
    return await getElementById(fileId, StorageFile);
}



//Retorna todos los archivos guardados en la BD sin la data, pero con el link de acceso
const getFilesWithoutData = async ( fileData ) => {
    const files = getFiles(fileData);
    const responseFiles =  files.map(file => {
        const { id, name, urlName } = file;
        return {
            id,
            name,
            urlName,
            url : `${host}/public/${file.urlName}`,
        }
    });
    return responseFiles
}



//Se encarga de almacenar un archivo en la BD
const createFile = async ( fileData ) => {
    const check = checkNewFileData(fileData)
    if(check !== true)
        throw { code : 400, response : { message : `Se ha ingresado un ${check} incorrecto`}}
    const { name, file, type } = fileData;
    const { data } = file;
    const urlName = getNewFileName(file, type);
    const newFileData = { name, data, urlName };
    if(currentFile && currentFile[0]) 
        throw { code: 500, response: { message : 'Error al crear el archivo'}};
    await createElement( newFileData, StorageFile);
    createTmpImageFile(urlName, data);
    return { message: 'Archivo creado con exito' };
}

//Se encarga de eliminar el archivo
const deleteFile = async( fileData ) => {
    const { fileId, urlName } = fileData;
    if(!checkDeleteFileData(fileId, urlName))
        throw { code: 500, response: { message : 'Parametros incorrectos'}};
    let currentFile = await getFiles( { id: mediaId, urlName });
    currentFile = (currentFile && Array.isArray(currentFile) ? currentFile[0] : currentFile);
    if(!currentFile)
        throw { code: 500, response: { message : 'Error al eliminar el archivo'}};
    urlName = currentFile.urlName;
    mediaId = currentFile.id;
    await StorageFile.findByIdAndDelete(mediaId);
    removeFile(urlName);
    return { message: 'Archivo eliminado con exito' };
}


module.exports = { 
    getFiles, 
    getFilesById,
    getFilesWithoutData,
    createFile,
    deleteFile
}