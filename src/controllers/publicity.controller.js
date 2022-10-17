const Publicity = require('../models/Publicity');
const { formatObjectResponse, getFormatParameters } = require('../helpers/formatData');
const { checkNewPublicityData } = require('../helpers/checkData');

//Crea un nuevo anuncio, asignando el nombre al archivo, y almacenandolo.
const createAd = async ( {name, altText, link, type, creatorName, creatorId, urlImage} ) => {
    const check = checkNewPublicityData({ name, type });
    if(check !== true)
        throw {code: 400, response: {message: `Se ha ingresado un ${check} incorrecto`}};
    const newAd = new Publicity({ name, altText, creatorName, creatorId, link, type, urlImage })
    await newAd.save();
    return { message : 'La publicidad ha sido creada exitosamente'}
}

//Se encarga de actualizar la data de un anuncio, lo unico que no se puede modificar es la imagen, debido a que se entiende que cada imagen
//es un anuncio distinto.
const updateAd = async (data) => {
    const { name, altText, link, type, adId, urlImage } = data;
    if(!adId || adId.length !== 24 )
        throw {code: 400, response: { message: 'Parametros incorrectos'}};
    const formatAttributes = getFormatParameters({name, altText, link, type, urlImage }, [ 'name', 'altText', 'link', 'type', 'urlImage' ]);
    await Publicity.findByIdAndUpdate(adId, formatAttributes);
    return { message: 'El aviso fue actualizado exitosamente' }
}

//Se encarga de eliminar el anuncio especificado con el Id
const deleteAd = async (adId) => {
    if(!adId || adId.length !== 24)
        throw {code: 400, response: { message: 'Parametros incorrectos'}};
    const ad = await Publicity.findById(adId).lean();
    if(!ad)
        throw {code: 400, response: { message: 'Parametros incorrectos'}};
    await Publicity.findByIdAndDelete(adId);
    return { message: 'El aviso fue removido con exito'}
}

//Se encarga de obtener los anuncios de la BD, se puede especificar tipo.
const getAds = async (type) => {
    const ads = await (type ? Publicity.find({type}).lean() : Publicity.find().lean());
    const formatResponse = Array.isArray(ads) ? ads.map(ad => formatObjectResponse(ad)) : [formatObjectResponse(ads)];
    return formatResponse;
}

module.exports = { createAd, updateAd, deleteAd, getAds }