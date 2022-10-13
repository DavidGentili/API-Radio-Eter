const StorageFile = require('../models/StorageFile');
const { formatObjectResponse } = require('../helpers/formatData');
const { createTmpImageFile } = require('../helpers/storage');
const { host } = require('../config');
const { checkId } = require('../helpers/checkData');
const { getQueryParams } = require('../helpers/formatData');

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
    console.log(files.length);
    const responseFiles =  files.map(file => {
        const { id, name, urlName } = file;
        return {
            id,
            name,
            urlName,
            url : `${host}/public/${file.urlName}`,
        }
    });
    console.log(responseFiles);
    return responseFiles
}

//Se encarga de almacenar un archivo en la BD
const createFile = async ( { name, data, urlName } ) => {
    if(!urlName || urlName.length < 3 || !data)
        throw { code: 500, response: { message : 'Error al crear el archivo'}};
    name = name ? name : 'Nombre';
    const currentFile = await getFiles(urlName);
    if(currentFile && currentFile[0]) 
        throw { code: 500, response: { message : 'Error al crear el archivo'}};
    const newFile = new StorageFile({ name, data, urlName });
    await newFile.save();
    createTmpImageFile(name, data);
    return { message: 'Archivo creado con exito' };
}

//Se encarga de eliminar el archivo
const deleteFile = async( {id, urlName } ) => {
    if(!id || !urlName || (id && !checkId(id)))
        throw { code: 500, response: { message : 'Error al eliminar el archivo'}};
    const queryParams = getQueryParams(urlName);
    const currentFile = (id) ? await StorageFile.findById(id).lean() : await StorageFile.find( queryParams ).lean();
    if(!currentFile)
        throw { code: 500, response: { message : 'Error al eliminar el archivo'}};
    
    id = currentFile.id;
    await StorageFile.findByIdAndDelete(id);
    return { message: 'Archivo eliminado con exito' };
}

module.exports = { getFiles, getFilesWithoutData, createFile, deleteFile}