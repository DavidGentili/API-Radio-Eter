const fs = require('fs');

const createTmpImageFile = (name, data) => {
    if(!fs.existsSync('./public'))
        fs.mkdirSync('./public');
    fs.writeFileSync(`./public/${name}`, data);
}

const existFile = (name) =>{
    return fs.existsSync('./public/' + name);
}

const getNewFileName = (file, base) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = file.mimetype.split('/').pop();
    return `${base}-${uniqueSuffix}.${extension}`;
}


module.exports = { createTmpImageFile, existFile, getNewFileName };