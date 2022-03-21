const {config} = require('dotenv')
config();

module.exports = {
    mongodbURL: process.env.MONGODB_URI,
    privateKey: process.env.PRIVATE_KEY,
}