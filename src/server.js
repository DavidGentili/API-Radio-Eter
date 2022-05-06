const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {port} = require('./config');
const cors = require('cors');

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static('./public'))

//Routes
app.use(require('./routes/users'));
app.use(require('./routes/publicity'));
app.use(require('./routes/program'))

app.set('port', port || 5500)

app.get('/', (req,res) => {
    res.json({message: 'welcome to the Radio Eter MDP API'})
})

app.listen(app.get('port'), () => {
    console.log('Hello, i´m a server that listen in port ' + app.get('port'))
})

