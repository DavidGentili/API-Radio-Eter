const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const StorageFileShema = new Schema({
    name : { type: String, required : true },
    data : { type: Buffer, required: true },

}, { versionKey : false });

module.exports = mongoose.model('StorageFile', StorageFileShema);