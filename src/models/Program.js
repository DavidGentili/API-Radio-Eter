const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
    name: { type: String, require: true },
    startHour: { type: String, require: true },
    finishHour: { type: String, require: true },
    days : { type: [Boolean], require: true },
    highlighted : { type: Boolean, required: true },
    urlImage: { type: String },
    creatorName: { type: String, required: true },
    creatorId: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model('Program', ProgramSchema);