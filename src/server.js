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
app.use(require('./routes/specialTransmission'))
app.use(require('./routes/programGrid'));


app.set('port', port || 9000)

app.get('/', (req,res) => {
    console.log(__dirname);
    res.json({message: 'welcome to the Radio Eter MDP API'})
})

app.listen(app.get('port'), () => {
    console.log('Hello, i´m a server that listen in port ' + app.get('port'))
})

