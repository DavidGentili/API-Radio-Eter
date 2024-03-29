const mongoose = require('mongoose');
const SourceSchema = require('./SourceSchema');
const Schema = mongoose.Schema;


const episodeElementSchema = new Schema({
    episodeId : {type: String, required: true},
    order : { type: Number},
})

const PodcastSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    tags: { type: [String] },
    urls: { type: SourceSchema },
    imgUrl: { type: String },
    episodesId: { type: [episodeElementSchema], default : [] },
    active : { type : Boolean, required : true, default : true},

}, {
    timestamps: true,
    versionKey: false,
})

module.exports = mongoose.model('Podcast', PodcastSchema);