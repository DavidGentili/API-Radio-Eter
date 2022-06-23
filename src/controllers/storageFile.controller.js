const StorageFile = require('../models/StorageFile');
const { formatObjectResponse } = require('../helpers/formatData');
const { createTmpImageFile } = require('../helpers/storage');

//Obtiene todos los archivos guardados en la BD
const getFiles = async () => {
    const files = await StorageFile.find().lean();
    return (Array.isArray(files)) ? files.map(file => formatObjectResponse(file)) : formatObjectResponse(files);
}

//Retorna el archivo almacenado en la BD que tiene dicho nombre
const getFileByName = async ( name ) => {
    const file = await StorageFile.findOne({ name }).lean();
    return file ? formatObjectResponse(file) : undefined;
}

//Se encarga de almacenar un archivo en la BD
const createFile = async (name, data) => {
    if(!name || name.length < 3 || !data)
        throw { code: 500, response: { message : 'Error al crear el archivo'}};
    const currentFile = await getFileByName(name);
    if(currentFile) 
        throw { code: 500, response: { message : 'Error al crear el archivo'}};
    const newFile = new StorageFile({ name, data });
    await newFile.save();
    createTmpImageFile(name, data);
    return { message: 'Archivo creado con exito' };
}

//Elimina un arhcivo de la BD segun un id ingresado
const deleteFileById = async ( id ) => {
    if(!id && typeof(id) !== 'string' && id.length !== 24)
        throw { code: 500, response: { message : 'Error al eliminar el archivo'}};
    await StorageFile.findByIdAndDelete(id);
    return { message: 'Archivo eliminado con exito' };
}

//Elimina un archivo de la BD segun un nombre ingresado
const deleteFileByName = async ( name ) => {
    const currentFile = getFileByName(name);
    if(!currentFile)
        throw { code: 500, response: { message : 'Error al eliminar el archivo'}};
    const { id } = currentFile;
    await StorageFile.findByIdAndDelete(id);
    return { message: 'Archivo eliminado con exito' };
}

module.exports = { getFiles, getFileByName, createFile, deleteFileById, deleteFileByName}