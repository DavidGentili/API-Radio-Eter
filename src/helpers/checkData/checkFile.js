const { checkName, checkId } = require('./checkData');
const { isString } = require('../checkTypes');


const checkNewFileData = ({ name, file, type } ) => {
    if(name && !checkName(name)) return 'Nombre';
    if(type && !isString(type)) return 'Tipo';
    if(!file || !file.data) return 'Archivo';
    return true;
}

const checkDeleteFileData = (id, urlName) => {
    return checkId(id) || checkName(urlName)
}

module.exports = {
    checkNewFileData,
    checkDeleteFileData,
}