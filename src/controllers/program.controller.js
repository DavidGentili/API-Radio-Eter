const Program = require('../models/Program');
const { host } = require('../config');
const { checkNewProgramData, checkUpdateProgramData } = require('../helpers/checkData')
const { createFile, deleteFileByName } = require('./storageFile.controller');
const { getNewFileName } = require('../helpers/storage');
const { getFormatParameters, formatObjectResponse } = require('../helpers/formatData');


const saveProgramFile = async (file) => {
    const fileName = getNewFileName(file, 'program');
    await createFile(fileName, file.data);
    return `${host}/public/${fileName}`;
}

const ifhasUrlImageDeleteIt = (programId) => {
    const currentProgram = await Program.findById(programId);
    if(currentProgram.urlImage)
        await deleteFileByName(urlImage.split('/').pop());
}

const getPrograms = async (highlighted, id) => {
    const parameters = getFormatParameters({highlighted, id}, ['highlighted', 'id']);
    const programs = await Program.find(parameters).lean();
    const formatResponse = Array.isArray(programs) ? programs.map(program => formatObjectResponse(program)) : [formatObjectResponse(programs)];
    return formatResponse;
}

const createProgram = async (data) => {
    const check = checkNewProgramData(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `the ${check} information is wrong`}}
    const { name, startHour, finishHour, highlighted, days, creatorName, creatorId, imageFile } = data;
    const programData = {name, startHour, finishHour, highlighted, days, creatorName, creatorId};
    if( highlighted && imageFile )
        programData.urlImage = await saveProgramFile(imageFile);
    const newProgram = new Program(programData);
    await newProgram.save();
    return { message: 'El programa ha sido creado con exito'}
}


const updateProgram = async (data) => {
    const { programId } = data;
    const check  = checkUpdateProgramData(data);
    let urlImage = null;
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `the ${check} information is wrong`}};
    const { name, startHour, finishHour, highlighted, days } = data;
    if( highlighted && data.imageFile){
        ifhasUrlImageDeleteIt(programId);
        urlImage = saveProgramFile(imageFile);
    }
    const programData = getFormatParameters({ name, startHour, finishHour, highlighted, days, urlImage }, ['name', 'startHour', 'finishHour', 'highlighted', 'days', 'urlImage']);
    await Program.findByIdAndUpdate(programId, programData);
    return { message: 'El programa a sido actualizado con exito'};
}

const deleteProgram = async (programId) => {
    if(!programId || typeof(programId) !== 'string' || programId.length !== 24)
        throw { code: 400 , response: { message: 'Id de programa incorrecto' } }
    const currentProgram = await Program.findById(programId);
    if(!currentProgram)
        throw { code: 400 , response: { message: 'Id de programa incorrecto' } };
    await Program.findByIdAndDelete(programId);
    res.json({ message: 'El programa ha sido eliminado con exito' });
}

module.exports = { getPrograms, createProgram, updateProgram, deleteProgram }