const newAccountMessage = (name, password) => {
    return `<body style="background-color: #E1E1E1; padding: 128px 0;"> <section style="font-family: sans-serif; box-sizing: border-box; max-width: 500px;background-color: #FFFFFF;border-radius: 12px; padding: 20px 30px;text-align: center;color: #242424; margin: auto; box-shadow: 0px 0px 20px #24242430;"> <h2 style="font-size: 32px;">¡Bienvenido ${name}!</h2> <h4 style="font-size: 12px; font-weight: 400;">Se ha creado exitosamente tu cuenta en el sistema de administracion de Radio Eter MDP</h4> <h3 style="font-size: 16px; margin-top: 36px;">Tu nueva contraseña es:</h3> <h1 style="font-size: 24px; background-color: #4BC1EA30;margin: 24px auto 48px auto;padding: 16px; border-radius: 12px;">${password}</h1> <p style="font-size: 12px; font-weight: 400; color: #707070;">Le recordamos por favor cambiar a la brevedad la contraseña desde el portal de gestion del sistema, para evitar vulnerabilidades</p><h5>¡Muchas Gracias!</h5></section></body>`
}

const changePasswordMessage = (name) => {
    return `<body style="background-color: #E8E8E8; padding: 128px 0;"> <section style="font-family: sans-serif; box-sizing: border-box; max-width: 500px;background-color: #FFFFFF;border-radius: 12px; padding: 20px 30px;text-align: center;color: #242424;margin: 64px auto;box-shadow: 0px 0px 20px #24242430;"> <h1 style="font-size: 32px;">¡Contraseña modificada!</h1> <h4 style="font-size: 12px; font-weight: 400;">${name}, tu contraseña se ha modificado con exito</h4> <p style="font-size: 12px; font-weight: 400; color: #707070;">Si no fuiste tu quien solicito el cambio de constraseña, se pide que a la brevedad informe esto a los responsables del sistema, para evitar asi una vulnerabilidad en el sistema</p><h5>Muchas Gracias</h5> </section></body>`
}

module.exports = { 
    newAccountMessage,
    changePasswordMessage,
}