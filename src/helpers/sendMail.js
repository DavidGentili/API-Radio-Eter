const nodemailer = require('nodemailer');
const { userEmail, passwordEmail } = require('../config');
const { newAccountMessage, changePasswordMessage } = require('./htmlMessages');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeHeaderValue = (value = '') => String(value).replace(/[\r\n]+/g, ' ').trim();
const normalizeBodyValue = (value = '') => String(value).replace(/\r/g, '').trim();

const normalizeRecipient = (recipient = '') => {
    const value = String(recipient).trim();
    if (!EMAIL_REGEX.test(value))
        throw new Error('Invalid recipient email');

    return value.toLowerCase();
}

const sendMail = async ({to, subject, text, html}) => {
    if(!userEmail || !passwordEmail)
        throw new Error('Error in environment variables');

    const safeTo = normalizeRecipient(to);
    const safeSubject = normalizeHeaderValue(subject);
    const safeText = normalizeBodyValue(text);
    const safeHtml = typeof html === 'string' ? html : '';

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
            user: userEmail,
            pass: passwordEmail,
        },
    });

    await transporter.sendMail({
        from: 'David Gentili <davidezequielgentili@gmail.com>',
        to: safeTo,
        subject: safeSubject,
        text: safeText,
        html: safeHtml,
    });
}

const notifyNewUser = ({name, email, password}) => {
    const message = {
        to: email,
        subject : 'Bienvenido a Radio Eter MDP',
        text: `Bienvenido ${name} al sistema de administracion del sitio Radio Eter MDP, tu nueva contraseña es ${password}, te recordamos cambiarla a la brevedad, con el fin de evitar ataques al sistema\n ¡Muchas Gracias!`,
        html: newAccountMessage(name, password),
    }
    sendMail(message).catch((e) => {console.error(e)});
}

const notifyChangePassword = ({name, email}) => {
    const message = {
        to: email,
        subject : 'Cambio de contraseña - Radio Eter MDP',
        text: `La contraseña se ha cambiado con exito`,
        html: changePasswordMessage(name),
    }
    sendMail(message).catch((e) => {console.error(e)});
}

module.exports = {
    notifyNewUser,
    notifyChangePassword,
}

