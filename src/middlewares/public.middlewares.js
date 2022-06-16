const { createTmpImageFile, existFile } = require('../helpers/storage');
const { getFileByName } = require('../controllers/storageFile.controller');

const checkIfExistFile = async (req, res, next) => {
    try{
        const fileName = req.path.split('/').pop();
        if(!existFile(fileName)){
            const tempImage = getFileByName(fileName);
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