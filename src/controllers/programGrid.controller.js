const { formatObjectResponse } = require('../helpers/formatData');
const { compareStartHour } = require('../helpers/compare');
const { getTransmissions } = require('./specialTransmission.controller');
const { getPrograms, getProgramsByDay } = require('./program.controller');

//retorna una grilla completa de programas
const getFullGrid = async () => {
    const grid = new Array(7).fill(new Array);
    const queryPrograms = await getPrograms();
    const programs = (Array.isArray(queryPrograms)) ? queryPrograms.map(program => formatObjectResponse(program)) : [formatObjectResponse(queryPrograms)];
    grid.forEach((day, index, array) => {
        const programsOfTheDay = programs.filter(program => program.days[index])
        programsOfTheDay.sort(compareStartHour)
        array[index] = programsOfTheDay;
    })
    return grid;
}

//Retorna los programas que se emiten el dia ingresado
const getDayGrid = async (day) => {
    const queryPrograms = await getProgramsByDay(day);
    const programs = (Array.isArray(queryPrograms)) ? queryPrograms.map(program => formatObjectResponse(program)) : [formatObjectResponse(queryPrograms)];
    programs.sort(compareStartHour);
    return programs
}

//Retorna la transmision actual, en caso de que no halla una retorna undefined
const getTranmission = async () => {
    let transmissions = await getTransmissions({ active: true });
    if(!transmissions)
        return undefined;
    if(!Array.isArray(transmissions))
        transmissions = [transmissions];
    const now = new Date(Date.now())
    const currentTranmission = transmissions.find(transmission => (transmission.startTransmission < now && transmission.finishTransmission));
    return currentTranmission !== undefined ? {...formatObjectResponse(currentTranmission), type: 'transmission'} : undefined;
}

const isCurrentProgram = (program) => {
    const now = new Date(Date.now());
    const startDate = new Date(Date.now());
    const finishDate = new Date(Date.now());
    const [startHour, startMinute] = program.startHour.split(':');
    const [finishHour, finishMinute] = program.finishHour.split(':');
    startDate.setHours(Number(startHour), Number(startMinute), 0);
    finishDate.setHours(Number(finishHour),Number(finishMinute),0);
    return (startDate <= now && finishDate >= now) ? true : false;
}

const getProgram = async () => {
    const today = new Date(Date.now()).getDay();
    const programs = await getDayGrid(today-1);
    const currentprogram = programs.find(program => isCurrentProgram(program));
    console.log(currentprogram);
    return currentprogram ? {...formatObjectResponse(currentprogram), type: 'program'} : undefined;
}

const getCurrentProgram = async () => {
    const transmission = await getTranmission();
    const response = transmission ? transmission : await getProgram();
    return response ? response : { message: 'Radio Eter MDP'} 
}

module.exports = { getFullGrid, getCurrentProgram}