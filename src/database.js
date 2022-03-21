const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/radioEterMdp')
.then( () => {
    console.log('Database connected'); 
})
.catch( (e) => {
    console.error(e);
    console.log('error to connect Database');
});
