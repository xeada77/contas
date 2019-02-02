const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/contas-app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then(() => {
    console.log('Base de datos conectada');
}).catch((err) => {
    console.log(err);
})
