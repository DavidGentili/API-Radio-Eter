const Program = require('../models/Program');
const { checkNewProgramData, checkUpdateProgramData } = require('../helpers/checkData')
const { getFormatParameters, formatObjectResponse } = require('../helpers/formatData');

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

/*Crea un nuevo programa en la BD, se requiere un objeto que contenga:
    name,
    startHour,
    finishHour,
    highlighted,
    days,
    creatorName,
    creatorId,
    urlImage
*/
const createProgram = async (data) => {
    const check = checkNewProgramData(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `Se ha ingresado ${check} incorrecto`}}
    const { name, startHour, finishHour, highlighted, days, creatorName, creatorId, urlImage } = data;
    const programData = {name, startHour, finishHour, highlighted, days, creatorName, creatorId, urlImage };
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
    urlImage
 */
const updateProgram = async (data) => {
    const { programId } = data;
    const check  = checkUpdateProgramData(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `Se ha ingresado un ${check} incorrecto`}};
    const currentProgram = await Program.findById(programId);
    if(!currentProgram)
        throw { status: 400, resposne: { message : 'Se ha ingresado un id incorrecto' }}
    const { name, startHour, finishHour, highlighted, days, urlImage } = data;
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
    return { message: 'El programa ha sido eliminado con exito' };
}

module.exports = { getPrograms, createProgram, updateProgram, deleteProgram, getProgramsByDay }