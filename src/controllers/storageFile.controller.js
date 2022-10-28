const StorageFile = require('../models/StorageFile');
const { formatObjectResponse } = require('../helpers/formatData');
const { createTmpImageFile, getNewFileName, removeFile } = require('../helpers/storage');
const { host } = require('../config');
const { checkId } = require('../helpers/checkData');
const { getQueryParams } = require('../helpers/formatData');

const corretParameters = (id, urlName) => {
    return urlName || (id && checkId(id))
}

//Obtiene todos los archivos guardados en la BD
const getFiles = async ({ id, urlName }) => {
    const queryParams = getQueryParams( { urlName } );
    const files = (id) ? await StorageFile.findById(id).lean() : await StorageFile.find( queryParams ).lean();
    return (Array.isArray(files)) ? files.map(file => formatObjectResponse(file)) : formatObjectResponse(files);
}

//Retorna todos los archivos guardados en la BD sin la data, pero con el link de acceso
const getFilesWithoutData = async ( { id , urlName }) => {
    const queryParams = getQueryParams( { urlName } );
    let files = (id) ? await StorageFile.findById(id).lean() : await StorageFile.find( queryParams ).lean();
    files = (Array.isArray(files)) ? files.map(file => formatObjectResponse(file)) : [formatObjectResponse(files)];
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
const createFile = async ( { name, file, type } ) => {
    const urlName = getNewFileName(file, type ? type : 'media');
    if(!file || !file.data)
        throw { code : 500, response : { message : 'Error al crear el archivo'}}
    const { data } = file;
    return await createNewFile( name, data, urlName);
}

const createNewFile = async ( name = 'Nombre', data, urlName ) => {
    if(!urlName || urlName.length < 3 || !data)
        throw { code: 500, response: { message : 'Error al crear el archivo'}};
    const currentFile = await getFiles({ urlName });
    if(currentFile && currentFile[0]) 
        throw { code: 500, response: { message : 'Error al crear el archivosss'}};
    const newFile = new StorageFile({ name, data, urlName });
    await newFile.save();
    createTmpImageFile(urlName, data);
    return { message: 'Archivo creado con exito' };
}

//Se encarga de eliminar el archivo
const deleteFile = async( {mediaId, urlName } ) => {
    if(!corretParameters(mediaId, urlName))
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


module.exports = { getFiles, getFilesWithoutData, createFile, deleteFile}