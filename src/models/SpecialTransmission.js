const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SpecialTransmissionSchema = new Schema({
    name: { type: String, required: true },
    startTransmission: { type: Date, required: true},
    finishTransmission: { type: Date, required: true},
    active : { type: Boolean, required: true, default: true},
    creatorName: { type: String, required: true },
    creatorId: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('SpecialTransmission', SpecialTransmissionSchema);