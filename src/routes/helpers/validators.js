const Ano = require('../../models/Ano');

const validators = {};

validators.existeAno = async (ano) => {
    const anoAlmacenado = await Ano.findOne({ ano: ano });
    if (anoAlmacenado) {
        return true;
    } else {
        return false;
    }
}