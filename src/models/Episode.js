const mongoose = require('mongoose');
const SourceSchema = require('./SourceSchema');
const Schema = mongoose.Schema;

const EpisodeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    urls: { type: SourceSchema },
    imgUrl: { type: String },
    active : { type : Boolean, required : true, default : true},
}, {
    timestamps: true,
    versionKey: false,
})

module.exports = mongoose.model('Episode', EpisodeSchema);