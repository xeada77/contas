const mongoose = require('mongoose');
const { Schema } = mongoose;


const categoriaSchema = new Schema({
    nombre: { type: String, required: true },
    codigo: { type: String, required: true, unique: true },
    ingreso: { type: Boolean, default: false },
});

module.exports = mongoose.model('Categoria', categoriaSchema);