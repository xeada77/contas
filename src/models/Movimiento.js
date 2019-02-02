const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const movimientoSchema = new Schema({
    fecha: { type: Date, required: true },
    concepto: { type: String, required: true },
    cantidad: { type: Schema.Types.Decimal128, required: true },
    categoria: { type: ObjectId, ref: 'Categoria' },
    ano: { type: ObjectId, ref:'Ano' }
});

module.exports = mongoose.model('Movimiento', movimientoSchema);