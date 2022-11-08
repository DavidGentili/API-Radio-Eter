const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {port} = require('./config');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { checkIfExistFile } = require('./middlewares/public.middlewares');

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload({
    limits : { fileSize: 10 * 1024 * 1024}
}))
app.use('/public', checkIfExistFile);
app.use('/public', express.static('./public'))

//Routes
app.use(require('./routes/users.route'));
app.use(require('./routes/publicity.route'));
app.use(require('./routes/program.route'));
app.use(require('./routes/specialTransmission.route'));
app.use(require('./routes/programGrid.route'));
app.use(require('./routes/media.route'));
app.use(require('./routes/report.route'));


app.set('port', port || 9000)

app.get('/', (req,res) => {
    console.log(__dirname);
    res.json({message: 'welcome to the Radio Eter MDP API'})
})

app.listen(app.get('port'), () => {
    console.log('Hello, i´m a server that listen in port ' + app.get('port'))
})

