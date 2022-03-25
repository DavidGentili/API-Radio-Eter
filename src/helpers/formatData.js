const getFormatParameters = (object, keys) => {
    const aux = {};
    if(Array.isArray(keys)){
        keys.forEach(key => {
            if(object[key])
                aux[key] = object[key];
        })
    }
    return aux
}

const getFormatUser = (objectUser) => {
    const keys = ['name', 'email', 'securityLevel', 'createdAt', 'state']
    const user = {};
    user.id = objectUser.id;
    keys.forEach(key => {
        if(key !== 'password' && objectUser[key]) 
            user[key] = objectUser[key]
    });
    return user;
}

module.exports = { 
    getFormatParameters,
    getFormatUser,
}