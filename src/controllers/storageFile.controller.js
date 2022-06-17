const StorageFile = require('../models/StorageFile');
const { formatObjectResponse } = require('../helpers/formatData');
const { createTmpImageFile } = require('../helpers/storage');


const getFiles = async (name) => {
    const files = await StorageFile.find().lean();
    return (Array.isArray(files)) ? files.map(file => formatObjectResponse(file)) : formatObjectResponse(files);
}

const getFileByName = async ( name ) => {
    const file = await StorageFile.findOne({ name }).lean();
    return file ? formatObjectResponse(file) : undefined;
}

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

const deleteFileById = async ( id ) => {
    if(!id && typeof(id) !== 'string' && id.length !== 24)
        throw { code: 500, response: { message : 'Error al eliminar el archivo'}};
    await StorageFile.findByIdAndDelete(id);
    return { message: 'Archivo eliminado con exito' };
}

const deleteFileByName = async ( name ) => {
    const currentFile = getFileByName(name);
    if(!currentFile)
        throw { code: 500, response: { message : 'Error al eliminar el archivo'}};
    const { id } = currentFile;
    await StorageFile.findByIdAndDelete(id);
    return { message: 'Archivo eliminado con exito' };
}

module.exports = { getFiles, getFileByName, createFile, deleteFileById, deleteFileByName}