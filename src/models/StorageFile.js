const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const StorageFileShema = new Schema({
    name : { type: String, required : true },
    urlName : { type: String, required : true }, 
    data : { type: Buffer, required: true },
    createdAt : {type: Date, default: Date.now()},

}, { versionKey : false });



module.exports = mongoose.model('StorageFile', StorageFileShema);