const StorageFile = require('../models/StorageFile');
const { createTmpImageFile, getNewFileName, removeFile } = require('../helpers/storage');
const { host } = require('../config');
const { checkNewFileData, checkDeleteFileData } = require('../helpers/checkData/checkFile');
const { getQueryParams, getFormatParameters } = require('../helpers/formatData');
const { getElements, getElementById, createElement } = require('./element.controller');


const getFiles = async (fileData) => {
    const queryParams = getQueryParams(fileData);
    return await getElements(queryParams, StorageFile);
}

const getFilesById = async (fileId) => {
    return await getElementById(fileId, StorageFile);
}



//Retorna todos los archivos guardados en la BD sin la data, pero con el link de acceso
const getFilesWithoutData = async ( fileData ) => {
    const files = await getFiles(fileData);
    const responseFiles =  files.map(({ id, name, urlName, createdAt }) => {
        return {
            id,
            name,
            urlName,
            url : `${host}/public/${urlName}`,
            createdAt,
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
    await createElement( newFileData, StorageFile);
    createTmpImageFile(urlName, data);
    return { message: 'Archivo creado con exito' };
}

//Se encarga de eliminar el archivo
const deleteFile = async ( { fileId, urlName} ) => {
    if(!checkDeleteFileData(fileId, urlName))
        throw { code: 500, response: { message : 'Parametros incorrectos'}};
    let currentFile =  ( fileId ) ? await getFilesWithoutData({ _id : fileId}) : await getFilesWithoutData({ urlName });
    currentFile = (currentFile && Array.isArray(currentFile) ? currentFile[0] : currentFile);
    if(!currentFile)
        throw { code: 500, response: { message : 'Error al eliminar el archivo'}};
    urlName = currentFile.urlName;
    fileId = currentFile.id;
    await StorageFile.findByIdAndDelete(fileId);
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