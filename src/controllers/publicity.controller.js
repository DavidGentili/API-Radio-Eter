const Publicity = require('../models/Publicity');
const { formatObjectResponse, getFormatParameters } = require('../helpers/formatData');
const { checkNewPublicityData } = require('../helpers/checkData');
const { host } = require('../config');
const { getNewFileName } = require('../helpers/storage');


const createAd = async ( {name, altText, link, type, creatorName, creatorId, imageFile} ) => {
    const check = checkNewPublicity(name, type);
    const fileName = getNewFileName(imageFile, 'ad');
    

}

const updateAd = async (data) => {
    const { name, altText, link, type, adId } = data;
    if(!adId || adId.length !== 24 )
        throw {code: 400, response: { message: 'wrong parameters'}};
    const formatAttributes = getFormatParameters({name, altText, link, type }, [ 'name', 'altText', 'link', 'type' ]);
    await Publicity.findByIdAndUpdate(adId, formatAttributes);
    return { message: 'ad updated successfully' }
}

const deleteAd = async (adId) => {
    if(!adId || adId.length !== 24)
        throw {code: 400, response: { message: 'wrong parameters'}};
    const ad = await Publicity.findById(adId).lean();
    if(!ad)
        throw {code: 400, response: { message: 'wrong parameters'}};
    const url = ad.urlImage;
    await Publicity.findByIdAndDelete(adId);
    removeFile(url.replace(host,'.'));
    return { message: 'the ad was removed sucessfull'}
}

const getAds = async () => {

}

module.exports = { createAd, updateAd, deleteAd, getAds }