const getFormatParameters = (object, keys) => {
    const aux = {};
    if(Array.isArray(keys)){
        keys.forEach(key => {
            if(object[key])
                aux[key] = object[key];
        })
    }
    return aux;
}

const formatObjectResponse = (object) => {
    if(!object)
        return undefined;
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