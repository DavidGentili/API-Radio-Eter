const { formatObjectResponse, getFormatParameters } = require('../helpers/formatData');
const { checkId } = require('../helpers/checkData/checkData');
const { default: mongoose } = require('mongoose');


/**
 * retorna un arreglo con los elementos del modelo que cumplan con la query 
 * pre: el criterio de busqueda debe estar correctamente formateado para evitar undefined o resultados incorrectos
 * @param {*} query : criterio de busqueda
 * @param {mongoose.Model} Model : Modelo en el cual buscar
 * @returns arreglo con los elementos correspondientes al criterio de busqueda
 */
 const getElements = async (query, Model) => {
    try{
        const elements = await Model.find({query}).lean();
        const formatResponse = Array.isArray(elements) ? elements.map(element => formatObjectResponse(element)) : [formatObjectResponse(elements)];
        return formatResponse;
    } catch(e){
        throw { code : 500, response : { message : 'Error al consultar el elemento'}}
    }

}

/**
 * Retorna un elemento dentro del modelo con el id especificado caso contrario excepcion
 * @param {String} elementId 
 * @param {mongoose.Model} Model
 * @return 
 */
const getElementById = async (elementId, Model) => {
    if(!elementId || !checkId(elementId))
        throw {code: 500, response: { message: 'numero de id incorrecto'}};
    try{
     const element = Model.findById(elementId).lean();
     return formatObjectResponse(element);
    }catch(e){
        throw { code : 500, response : { message : 'Error al consultar el elemento'}}
    }
}

/**
 * Se encarga de crear el elemento dentro del modelo ingresado
 * @param {*} dataElement : data del nuevo elemento
 * @param {mongoose.Model} Model : modelo del elemento que se desea crear
 * @returns {message : String} un objeto con el atributo message con el mensaje de exito
 */
const createElement = async ( dataElement, Model ) => {
    try{
        const newElement = new Model(dataElement);
        await newElement.save();
        return { message : 'el elemento se ha creado exitosamente'};

    } catch(e){
        console.log(e);
        throw { code : 500, response : { message : 'Error al crear el elemento'}}
    }
}

/**
 * Se encarga de actualizar un elemento del modelo ingresado
 * pre: La data debe estar formateada adecuadamente
 * @param {*} dataElement : data el elemento
 * @param {String} elementId : id del elemento
 * @param {mongoose.Model} Model : Modelo del elemento a modificar
 * @returns : mensaje de exito de la operacion
 */
const updateElement = async (elementData, elementId, Model) => {
    if(!elementId || !checkId(elementId) )
        throw {code: 400, response: { message: 'Parametros incorrectos'}};
    try{
        await Model.findByIdAndUpdate(elementId, elementData);
        return { message : 'El elemento fue actualizado con exito' }
    } catch(e){
        throw { code : 500, response : { message : 'Error al actualizar el elemento'}}
    }
}

/**
 * Se encarga de eliminar un elemento con un id y un modelo correspondiente
 * @param {String} elementId : id del elemento a eliminar
 * @param {mongoose.Model} Model : Modelo del elemento
 * @returns : mensaje de exito de la operacion
 */
const deleteElement = async (elementId, Model) => {
    if(!elementId || !checkId(elementId))
        throw {code: 400, response: { message: 'Parametros incorrectos'}};
    const element = await Model.findById(elementId);
    if(!element)
        throw {code: 400, response: { message: 'numero de id incorrecto'}};       
    try{
        await Model.findByIdAndDelete(elementId);
        return { message: 'El aviso fue removido con exito'}
    }catch(e){
        throw { code : 500, response : { message : 'Error al eliminar el elemento'}}
    }
}

module.exports = {
    getElements,
    getElementById,
    createElement,
    updateElement,
    deleteElement,
}