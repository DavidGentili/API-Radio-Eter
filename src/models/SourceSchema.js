const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SourceSchema = new Schema({
    google : { type : String, },
    spotify : { type : String },
    youtube : { type : String },
    soundcloud : { type : String },
})

module.exports = SourceSchema;