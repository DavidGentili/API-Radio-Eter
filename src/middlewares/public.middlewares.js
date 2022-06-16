const StorageFile = require('../models/StorageFile');
const { createTmpImageFile, existFile } = require('../helpers/storage');

const checkIfExistFile = async (req, res, next) => {
    try{
        const fileName = req.path.split('/').pop();
        if(!existFile(fileName)){
            const tempImage = await StorageFile.findOne({name: fileName});
            if(tempImage){
                const { name, data } = tempImage;
                createTmpImageFile(name, data);
            }
        }
    } catch(e){
        console.log(e);
    }
    next();
}

module.exports = {
    checkIfExistFile,
}