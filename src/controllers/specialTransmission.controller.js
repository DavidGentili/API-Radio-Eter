const SpecialTransmission = require('../models/SpecialTransmission');
const { checkNewSpecialTransmission, checkUpdateSpecialTransmission } = require('../helpers/checkData/checkData');
const { getFormatParameters, formatObjectResponse } = require('../helpers/formatData');

const updateActiveTransmission = async () => {
    const now = new Date(Date.now());
    const transmissions = await SpecialTransmission.find({active: true}).lean();
    transmissions.forEach( async (transmission) => {
        if(now > transmission.finishTransmission)
            await SpecialTransmission.findByIdAndUpdate(transmission._id, {active : false});
    })
}

const updateTransmission = async (data) => {
    const { transmissionId } = data; 
    const check = checkUpdateSpecialTransmission(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `Se ha ingresado un ${check} incorrecto`}};
    const { name, startTransmission, finishTransmission, active } = data;
    await SpecialTransmission.findByIdAndUpdate(transmissionId, { name, startTransmission, finishTransmission, active });
    await updateActiveTransmission();
    return { message: 'La transmision fue actualizada con exito' };
}

const createSpecialTransmission = async (data) => {
    const check = checkNewSpecialTransmission(data);
    if(typeof(check) === 'string')
        throw { status: 400 , response: { message : `Se ha ingresado un ${check} incorrecto`}};
    await updateActiveTransmission();
    const newTransmission = await new SpecialTransmission(data);
    await newTransmission.save();
    return { message: 'La transmision fue creada con exito' };
}

const getTransmissions = async (params) => {
    const parameters = getFormatParameters(params, ['active', 'name']);
    const transmissions = await SpecialTransmission.find(parameters).lean();
    const formatTransmission = Array.isArray(transmissions) ? transmissions.map(transmission => formatObjectResponse(transmission)) : [formatObjectResponse(transmissions)];
    return formatTransmission;
}

const deleteTransmission = async (transmissionId) => {
    if(typeof(transmissionId) !== 'string' || transmissionId.length !== 24)
        throw { code: 400, response: { message: 'Id de transmision incorrecto' }};
    const currentTransmission = await SpecialTransmission.findById(transmissionId);
    if(!currentTransmission)
        throw { code: 400, response: { message: 'Id de transmision incorrecto' }};
    await SpecialTransmission.findByIdAndDelete(transmissionId);
    await updateActiveTransmission();
    return { message: 'La transmision ha sido eliminado con exito' }
}

module.exports = { createSpecialTransmission, updateTransmission, getTransmissions, deleteTransmission}