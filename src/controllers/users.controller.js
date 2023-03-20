const User = require('../models/User');
const generator = require('generate-password');
const { authenticateUser } = require('../helpers/auth');
const { checkNewUserData, checkUpdateUserData } = require('../helpers/checkData/checkUser');
const { notifyNewUser, notifyChangePassword } = require('../helpers/sendMail');
const { getQueryParams, getFormatParameters, dataToLowerCase } = require('../helpers/formatData');
const { getElements, getElementById, createElement, updateElement, deleteElement } = require('./element.controller');

const lowerCaseKeys = [
    'email',
    'securityLevel',
    'state'
]

const getUsers = async (userData) => {
    const queryParams = getQueryParams(userData, ['id', 'name', 'state', 'securityLevel','email']);
    return await getElements(queryParams, User);
}

const getUserById = async (userId) => {
    return await getElementById(userId, User);
}

const signupUser = async (userData) => {
    dataToLowerCase(userData, lowerCaseKeys);
    const check = checkNewUserData(userData) 
    if(check !== true) // Si la informacion no es correcta se retorna un mensaje de error
        throw {code: 400, response: {message: `Se ha ingresado un ${check} incorrecto`}};
    const {email, name } = userData;
    const currentUser = getUsers({ email }, User);
    if(currentUser && currentUser[0] && currentUser[0].email && currentUser[0].email === email)
        throw {code: 400, response: {message: 'El email que intenta registrar ya se encuentra registrado'}};
    try{
        const password = generator.generate({length: 10, numbers: true});
        await createElement({...userData, password}, User);
        notifyNewUser({ email, name, password }); // Se notifica al nuevo usuario la creacion de la cuenta
        return { message : 'El Usuario ha sido creado con exito'}
    }catch(e){
        throw { code : 400, response : { message : 'Error al crear el usuario '}};
    }
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

const updateUser = async (userData) => {
    dataToLowerCase(userData, lowerCaseKeys);
    const check = checkUpdateUserData(userData);
    if(check !== true)
        throw { code : 400, response : { message : `Se ha ingresado un ${check} incorrecto`}}
    try{
        const { userId } = userData;
        const updateData = getFormatParameters(userData, ['securityLevel', 'state']);
        await updateElement(updateData, userId, User);
        return { message : 'El usuario se ha actualizado con exito'};  
    } catch(e){
        throw { code : 400, response : { message : 'Error al actualizar el usuario '}};
    }
}

const deleteUser = async(userId) => {
    try{
        await deleteElement(userId, User);
        return { message : 'El usuario se ha eliminado con exito'};
    }catch(e){
        throw { code : 400, response : { message : 'Error al eliminar el usuario '}};
    }
}

module.exports = {
    getUsers,
    getUserById,
    signupUser,
    loginUser,
    changePassword,
    updateUser,
    deleteUser,
}