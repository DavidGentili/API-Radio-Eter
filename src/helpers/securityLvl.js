const securityLevels = [
    'master',
    'admin',
    'editor'
]

//Se asegura que el nivel de seguridad sea el necesario para poder cargar la imagen al servidor
const correctSecurityLevel = (req, res, next) => {
    const { user } = req;
    const { securityLevelRequired } = req;
    if(!securityLevelRequired.includes(user.securityLevel)){
        res.statusCode = 403;
        res.json({message: 'the user doesn´t have the security level required to complete this action'});
    } else
        next();   
}

module.exports = {
    securityLevels,
    correctSecurityLevel,
};