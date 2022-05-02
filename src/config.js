module.exports = {
    mongodbURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/radioEterMdp',
    privateKey: process.env.PRIVATE_KEY || 'claveSecreta',
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'http://localhost',
    userEmail: process.env.USER_EMAIL || undefined,
    passwordEmail: process.env.PASSWORD_EMAIL || undefined,
}