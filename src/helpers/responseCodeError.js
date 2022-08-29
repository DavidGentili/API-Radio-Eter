const responseCodeError = (e, res) => {
    console.log(e);
    const {code = 500, response = {message: 'Internal Server Error'}} = e;
    res.status(code);
    res.json(response)
}

module.exports = responseCodeError;