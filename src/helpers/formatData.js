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
    user.id = objectUser.id || objectUser._id;
    keys.forEach(key => {
        if(key !== 'password' && objectUser[key]) 
            user[key] = objectUser[key]
    });
    return user;
}

const formatObjectResponse = (object) => {
    const keys = Object.keys(object);
    const exceptions = ['_id', 'password', '__v'];
    const newObject = {};
    newObject.id = object.id || object._id;
    keys.forEach(key => {
        if(!exceptions.includes(key))
            newObject[key] = object[key];
    })
    return newObject;
}

module.exports = { 
    getFormatParameters,
    formatObjectResponse,
}