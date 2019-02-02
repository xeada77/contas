const Ano = require("../models/Ano");

exports.customValidators = {
    /**
     * Comprueba si existe el año en la base de datos, en caso afirmativo la * promesa se resuelve, sino se desestima y se ejecuta el reject.
     */
    existeAno(anoid) {
        return new Promise((resolve, reject) => {
            Ano.findOne({ ano: anoid }, (err, ano) => {
                if (ano) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    }
};
