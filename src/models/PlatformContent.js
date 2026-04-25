const mongoose = require('mongoose');
const SourceSchema = require('./SourceSchema');
const Schema = mongoose.Schema;


const CarrouselContentSchema = new Schema({
    title: { type: String, },
    src: { type: String, required: true },
    order: { type: Number, required: true },
    link: { type: String },
    active: { type: Boolean, default: true },
})

const PlatformContentSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    contents: { type: [CarrouselContentSchema], default: [] },
}, {
    timestamps: true,
    versionKey: false,
})

module.exports = mongoose.model('PlatformContent', PlatformContentSchema);