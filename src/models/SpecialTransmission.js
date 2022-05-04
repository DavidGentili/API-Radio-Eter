const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SpecialTransmission = new Schema({
    name: { type: String, required: true },
    startTransmission: { type: Date, required: true},
    finishTransmission: { type: Date, required: true},
}, { })