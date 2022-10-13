const { createTmpImageFile, existFile } = require('../helpers/storage');
const { getFileByName, getFiles } = require('../controllers/storageFile.controller');

const checkIfExistFile = async (req, res, next) => {
    try{
        const fileName = req.path.split('/').pop();
        if(!existFile(fileName)){
            let tempFile = await getFiles( { urlName : fileName} );
            tempFile = (tempFile && Array.isArray(tempFile)) ? tempFile[0] : tempFile;
            if(tempFile){
                console.log('Here')
                const { urlName, data } = tempFile;
                createTmpImageFile(urlName, data.buffer);
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