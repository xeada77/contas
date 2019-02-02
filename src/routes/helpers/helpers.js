const Ano = require('../../models/Ano');
const Categoria = require('../../models/Categoria');


const helpers = {};

helpers.listaAnos = async () => {
    const anos = await Ano.find().sort({ ano: 1 });
    return anos;
};

helpers.listaCategorias = async () => {
    const categorias = await Categoria.find();
    return categorias;
}

helpers.esIngreso = (codigo) => {
    return codigo.substring(0,1).toLowerCase() === 'a'
}

helpers.opcionesAnos = () => {
    let opcionesAnos = [];
    for (let i = 0; i < 50; i++) {
    opcionesAnos.push({ number: 2000 + i });
    }
    return opcionesAnos;
}

module.exports = helpers;