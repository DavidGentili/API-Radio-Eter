const Publicity = require('../models/Publicity');
const { formatObjectResponse, getFormatParameters } = require('../helpers/formatData');
const { createFile } = require ('./storageFile.controller');
const { checkNewPublicityData } = require('../helpers/checkData');
const { host } = require('../config');
const { getNewFileName, deleteFileByName } = require('../helpers/storage');

//Crea un nuevo anuncio, asignando el nombre al archivo, y almacenandolo.
const createAd = async ( {name, altText, link, type, creatorName, creatorId, imageFile} ) => {
    const check = checkNewPublicityData(name, type);
    if(check !== true)
        throw {code: 400, response: {message: `Se ha ingresado un ${check} incorrecto`}};
    const fileName = getNewFileName(imageFile, 'ad');
    const urlImage = `${host}/public/${fileName}`;
    const { data } = imageFile;
    await createFile(fileName, data);
    const newAd = new Publicity({ name, altText, creatorName, creatorId, link, type, urlImage })
    await newAd.save();
    return { message : 'La publicidad ha sido creada exitosamente'}
}

//Se encarga de actualizar la data de un anuncio, lo unico que no se puede modificar es la imagen, debido a que se entiende que cada imagen
//es un anuncio distinto.
const updateAd = async (data) => {
    const { name, altText, link, type, adId } = data;
    if(!adId || adId.length !== 24 )
        throw {code: 400, response: { message: 'wrong parameters'}};
    const formatAttributes = getFormatParameters({name, altText, link, type }, [ 'name', 'altText', 'link', 'type' ]);
    await Publicity.findByIdAndUpdate(adId, formatAttributes);
    return { message: 'ad updated successfully' }
}

//Se encarga de eliminar el anuncio 
const deleteAd = async (adId) => {
    if(!adId || adId.length !== 24)
        throw {code: 400, response: { message: 'wrong parameters'}};
    const ad = await Publicity.findById(adId).lean();
    if(!ad)
        throw {code: 400, response: { message: 'wrong parameters'}};
    const nameFile = ad.urlImage.split('/').pop();
    await deleteFileByName(nameFile);
    await Publicity.findByIdAndDelete(adId);
    return { message: 'the ad was removed sucessfull'}
}

const getAds = async (type) => {
    const ads = await (type ? Publicity.find({type}).lean() : Publicity.find().lean());
    const formatResponse = Array.isArray(ads) ? ads.map(ad => formatObjectResponse(ad)) : [formatObjectResponse(ads)];
    return formatResponse;
}

module.exports = { createAd, updateAd, deleteAd, getAds }