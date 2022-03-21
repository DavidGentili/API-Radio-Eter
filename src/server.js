const express = require('express');
const res = require('express/lib/response');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

//Middlewares
app.use(bodyParser.json());

//Routes
app.use(require('./routes/users'));


app.listen(port, () => {
    console.log('Hello, i´m a server that listen in port ' + port)
})

