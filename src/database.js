const mongoose = require("mongoose");

const uri =
    "mongodb://appadmin:<password>@miclusterdepruebas-shard-00-00-fkukt.mongodb.net:27017,miclusterdepruebas-shard-00-01-fkukt.mongodb.net:27017,miclusterdepruebas-shard-00-02-fkukt.mongodb.net:27017/contas-app?ssl=true&replicaSet=MiClusterdePruebas-shard-0&authSource=admin&retryWrites=true";

mongoose
    .connect(
        // "mongodb://localhost:27017/contas-app",
        uri,
        {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false
        }
    )
    .then(() => {
        console.log("Base de datos conectada");
    })
    .catch(err => {
        console.log(err);
    });
