const responseCodeError = (e, res) => {
    const {code = 500, response = {message: 'Internal Server Error'}} = e;
    res.statusCode = code;
    res.json(response)
}

module.exports = responseCodeError;