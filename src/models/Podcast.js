const mongoose = require('mongoose');
const SourceSchema = require('./SourceSchema');
const Schema = mongoose.Schema;

const PodcastSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    tags: { type: [String] },
    urls: { type: SourceSchema },
    imgUrl: { type: String },
    episodesId: { type: [String] },

}, {
    timestamps: true,
    versionKey: false,
})

module.exports = mongoose.model('Podcast', PodcastSchema);