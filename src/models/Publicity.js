const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PublicitySchema = new Schema({
    name: { type: String, required: true },
    urlImage: { type: String },
    altText: { type: String },
    link: { type: String },
    type: { type: String, required: true },
    createdAt: {type: Date, default: Date.now()},
}, { versionKey: false });

module.exports = mongoose.model('Publicity', PublicitySchema);