const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportsSchema = new Schema({
    title: { type: String, require: true },
    description : { type: String},
    content : {type: String, required: true},
    mediaContent : { type: [String]},
    mainImageUrl : { type: String},
    creatorName: { type: String, required: true },
    creatorId: { type: String, required: true },
    createdAt : { type: Date, require: true },
    lastModify : { type: Date, required: true},
}, { versionKey: false });

module.exports = mongoose.model('Reports', ReportsSchema);