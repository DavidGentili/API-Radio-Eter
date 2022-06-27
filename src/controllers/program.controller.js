const Program = require('../models/Program');
const { host } = require('../config');
const { checkNewProgramData, checkUpdateProgramData } = require('../helpers/checkData')
const { createFile, deleteFileByName } = require('./storageFile.controller');
const { getNewFileName } = require('../helpers/storage');
const { getFormatParameters, formatObjectResponse } = require('../helpers/formatData');

//Guarda el archivo del programa creado, este archivo en escencia es una imagen
const saveProgramFile = async (file) => {
    const fileName = getNewFileName(file, 'program');
    await createFile(fileName, file.data);
    return `${host}/public/${fileName}`;
}

//Si el programa ingresado tiene una imagen asociada, se elimina la misma
const ifHasUrlImageDeleteIt = async (programId) => {
    const currentProgram = await Program.findById(programId);
    if(currentProgram.urlImage)
        await deleteFileByName(urlImage.split('/').pop());
}

//Retorna los programas almacenados en la BD, se puede especificar el Id o si es destacado
const getPrograms = async (highlighted, id) => {
    const parameters = getFormatParameters({highlighted, id}, ['highlighted', 'id']);
    const programs = await Program.find(parameters).lean();
    const formatResponse = Array.isArray(programs) ? programs.map(program => formatObjectResponse(program)) : [formatObjectResponse(programs)];
    return formatResponse;
}

const getProgramsByDay = async (day) => {
    const filter = {};
    filter[`days.${day}`] = true; 
    return await Program.find(filter).lean();
}

/*Crea un nuevo programa en la BD, se requiere un objeto que contenga (tipos especificado en el modelo de la BD):
    name,
    startHour,
    finishHour,
    highlighted,
    days,
    creatorName,
    creatorId,
    ImageFile ? (opcional)
*/
const createProgram = async (data) => {
    const check = checkNewProgramData(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `Se ha ingresado un ${check} incorrecto`}}
    const { name, startHour, finishHour, highlighted, days, creatorName, creatorId, imageFile } = data;
    const programData = {name, startHour, finishHour, highlighted, days, creatorName, creatorId};
    if( highlighted && imageFile )
        programData.urlImage = await saveProgramFile(imageFile);
    const newProgram = new Program(programData);
    await newProgram.save();
    return { message: 'El programa ha sido creado con exito'}
}

/* Actualiza la informacion de un programa en la BD, se pueden modificar:
    name,
    startHour,
    finishHour,
    highlighted,
    days,
    imageFile ? (opcional)
 */
const updateProgram = async (data) => {
    const { programId } = data;
    const check  = checkUpdateProgramData(data);
    let urlImage = null;
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `Se ha ingresado un ${check} incorrecto`}};
    const { name, startHour, finishHour, highlighted, days } = data;
    if( highlighted && data.imageFile){
        ifHasUrlImageDeleteIt(programId);
        urlImage = saveProgramFile(imageFile);
    }
    const programData = getFormatParameters({ name, startHour, finishHour, highlighted, days, urlImage }, ['name', 'startHour', 'finishHour', 'highlighted', 'days', 'urlImage']);
    await Program.findByIdAndUpdate(programId, programData);
    return { message: 'El programa a sido actualizado con exito'};
}

//Se encarga de eliminar un programa con un Id especificado
const deleteProgram = async (programId) => {
    if(!programId || typeof(programId) !== 'string' || programId.length !== 24)
        throw { code: 400 , response: { message: 'Id de programa incorrecto' } }
    const currentProgram = await Program.findById(programId);
    if(!currentProgram)
        throw { code: 400 , response: { message: 'Id de programa incorrecto' } };
    await Program.findByIdAndDelete(programId);
    if(currentProgram.highlighted && currentProgram.urlImage)
        await deleteFileByName(currentProgram.urlImage.split('/').pop());
    res.json({ message: 'El programa ha sido eliminado con exito' });
}

module.exports = { getPrograms, createProgram, updateProgram, deleteProgram, getProgramsByDay }