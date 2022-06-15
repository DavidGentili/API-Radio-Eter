const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    securityLevel: {type: String, required: true, default: 'editor'},
    state: {type: String, required: true, default: 'active'},
    createdAt: {type: Date, default: Date.now()},
    LastLog: {type: Date}
},{ versionKey: false })

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.hashPassword = async function(password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
}

UserSchema.pre('save', async function(){
    this.password = await this.hashPassword(this.password);
    this.email = this.email.toLowerCase();
})


module.exports = mongoose.model('User', UserSchema);