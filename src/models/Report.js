const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = Schema({
    title : { type : String, required : true },
    description : { type : String },
    content : { type : String },
    active : { type : Boolean, required : true, default : false},
    mainMediaUrl : { type : String },
    creatorId : { type : String, required : true},
    creatorName : { type : String, required : true},
    lastModify : { type : String, required : true}
})

module.exports = mongoose.model('Report', ReportSchema);