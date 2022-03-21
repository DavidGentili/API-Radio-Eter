const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    securityLevel: {type: String, required: true, default: 'editor'},
    initialLog: {type: Date, default: Date.now()},
    LastLog: {type: Date}
})

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    this.email = this.email.toLowerCase();
})

module.exports = mongoose.model('User', UserSchema);