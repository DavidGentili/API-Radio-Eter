module.exports = {
    mongodbURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/radioEterMdp',
    privateKey: process.env.PRIVATE_KEY || 'claveSecreta',
    port: process.env.PORT || 9000,
    host: process.env.HOST || 'http://localhost:9000',
    userEmail: process.env.USER_EMAIL || undefined,
    passwordEmail: process.env.PASSWORD_EMAIL || undefined,
}