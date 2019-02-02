const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/contas-app', {
    useCreateIndex: true,
    //useNewUrlParser: true,
    useFindAndModify: false
}).then(() => {
    console.log('Base de datos conectada');
}).catch((err) => {
    console.log(err);
})
