const mongoose = require('mongoose');
const {mongodbURL} = require('./config');

mongoose.connect(mongodbURL)
.then( () => {
    if(mongodbURL && typeof(mongodbURL) === 'string')
        console.log('Database connected: ' + mongodbURL.split(':')[1].replace('/','')); 
})
.catch( (e) => {
    console.error(e);
    console.log('error to connect Database');
});
