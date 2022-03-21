const express = require('express');
const res = require('express/lib/response');
const app = express();
const bodyParser = require('body-parser');

//Middlewares
app.use(bodyParser.json());

//Routes
app.use(require('./routes/users'));

app.set('port', process.env.PORT || 3000)

app.get('/', (req,res) => {
    res.json({message: 'welcome to the Radio Eter API'})
})

app.listen(app.get('port'), () => {
    console.log('Hello, i´m a server that listen in port ' + app.get('port'))
})

