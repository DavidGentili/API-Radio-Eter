const isString = (string) => typeof(string) === 'string';
const isBoolean = (bool) => typeof(bool) === 'boolean';
const isNumber = (number) => typeof(number) === 'number';
const isArray = (array) => Array.isArray(array);

module.exports = {
    isString,
    isBoolean,
    isNumber,
    isArray
}