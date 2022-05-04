const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
    name: { type: String, require: true },
    startHour: { type: Date, require: true },
    FinishHour: { type: Date, require: true },
    days : { type: Array, require: true },
    highlighted : { type: Boolean, required: true },
    urlImage: { type: String },
}, { versionKey: false });

module.exports = mongoose.model('Program', ProgramSchema);