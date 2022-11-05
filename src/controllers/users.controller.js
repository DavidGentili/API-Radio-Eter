const User = require('../models/User');
const { authenticateUser } = require('../helpers/auth');
const { formatObjectResponse, getFormatParameters } = require('../helpers/formatData');
const { securityLevels } = require('../helpers/securityLvl')
const { checkUserData } = require('../helpers/checkData/checkData');
const { notifyNewUser, notifyChangePassword } = require('../helpers/sendMail');
const generator = require('generate-password');



const signupUser = async (userData) => {
    const check = checkUserData(userData) 
    if(check !== true) // Si la informacion no es correcta se retorna un mensaje de error
        throw {code: 400, response: {message: `Se ha ingresado un ${check} incorrecto`}};
    const { name } = userData;
    const securityLevel = userData.securityLevel.toLowerCase();
    const email = userData.email.toLowerCase();
    const currentEmail = await User.findOne({ email }) 
    if(currentEmail)// se constata que no este repetido el mail
        throw {code: 400, response: {message: 'El email que intenta registrar ya se encuentra registrado'}};

    const password = generator.generate({length: 10, numbers: true}); //Se genera una contraseña aleatoria al nuevo usuario
    const newUser = new User({ email, name, password, securityLevel : securityLevel ? securityLevel : 'editor' });
    await newUser.save();
    notifyNewUser({ email, name, password }); // Se notifica al nuevo usuario la creacion de la cuenta
    return {message: 'El usuario se ha creado satisfactoriamente'};  
} 

const loginUser = async ({ email, password }) => {
    const currentUser = await User.findOne({email: email.toLowerCase()});
    if(!currentUser)
        throw {code: 403 , response: {message: 'Contraseña o usuario incorrecto'}}
    const matchPassword = await currentUser.matchPassword(password);
    if(matchPassword)
        return {token: authenticateUser(await User.findById(currentUser._id).lean())};
    else
        throw {code: 403, response: {message: 'Contraseña o usuario incorrecto'}};
    
        
}

const changePassword = async ({ currentPassword, newPassword, id }) => {
    if(!currentPassword || !newPassword || !id)
        throw {code: 400, response: {message: 'Parametros incorrectos'}}
    const currentUser = await User.findById(id);
    const matchPassword = await currentUser.matchPassword(currentPassword);
    if(!currentUser || !matchPassword )
        throw {code: 403, response: {message: 'Usuario no autorizado'}}
    const hashPassword = await currentUser.hashPassword(newPassword)
    await User.findByIdAndUpdate(id, {password: hashPassword});
    notifyChangePassword({name: currentUser.name, email : currentUser.email})
    return {message: 'La contraseña fue cambiada con exito'}
}

const updateUser = async ({ idUser, id, state, securityLevel }) => {
    if( (!state && (!securityLevel || !securityLevels.includes(securityLevel.toLowerCase()) )) || (!idUser || idUser.length !== 24) || !id)
        throw {code: 400, response: { message: 'Parametros incorrectos'}};
    if(securityLevel)
        securityLevel = securityLevel.toLowerCase();

    const parameters = getFormatParameters({state, securityLevel}, ['state','securityLevel']);
    await User.findByIdAndUpdate(idUser, parameters);
    return { message: 'El usuario fue actualizado con exito'}
    
}

const getUsers = async (searchId) => {
    const queryParameters = {};
    if(searchId && typeof(searchId) === 'string' && searchId.length === 24)
        queryParameters._id = searchId;
    const users = await User.find(queryParameters).lean();
    const formatUser = users.map(user => formatObjectResponse(user));
    return {users: formatUser};
}

const deleteUser = async (id) => {
    const currentUser = await User.findById(id);
    if(!currentUser)
        throw {code: 400, response: {message: 'Parametros incorrectors'}};
    await User.findByIdAndDelete(id);
    return {message: 'El usuario fue eliminado satisfactoriamente'}
}


module.exports = {
    signupUser,
    loginUser,
    changePassword,
    updateUser,
    getUsers,
    deleteUser,
}