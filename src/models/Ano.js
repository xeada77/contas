const mongoose = require('mongoose');
const { Schema, ObjectId} = mongoose;


const movimientoSchema = new Schema({
    fecha: { type: Date, required: true },
    concepto: { type: String, required: true },
    cantidad: { type: Schema.Types.Decimal128, required: true },
    categoria: { type: ObjectId, ref: 'Categoria' }
});

const anoSchema = new Schema({
    ano: { type: Number, required: true, unique: true },
    //saldoinicial: { type: String, required: true }
    saldoinicial: { type: Schema.Types.Decimal128, required: true },
    movimientos: { type: [movimientoSchema] }
});

module.exports = mongoose.model('Ano', anoSchema);