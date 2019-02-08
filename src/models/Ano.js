const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const movimientoSchema = new Schema({
    fecha: { type: Date, required: true },
    concepto: { type: String, required: true },
    cantidad: { type: Schema.Types.Decimal128, required: true },
    categoria: { type: ObjectId, ref: "Categoria" }
});

const anoSchema = new Schema({
    ano: { type: Number, required: true, unique: true },
    //saldoinicial: { type: String, required: true }
    saldoinicial: { type: Schema.Types.Decimal128, required: true },
    movimientos: { type: [movimientoSchema] }
});

anoSchema.statics.totalMovimientos = async function(ano) {
    const resultado = await this.aggregate([
        {
            $match: { ano: parseInt(ano) }
        },
        { $unwind: "$movimientos" },
        {
            $group: {
                _id: "$ano",
                total: { $sum: "$movimientos.cantidad" }
            }
        }
    ]);
    const total = resultado.length > 0 ? resultado[0].total.toString() : 0;
    return total;
    /*return this.aggregate(
        [
            {
                $match: { ano: parseInt(ano) }
            },
            { $unwind: "$movimientos" },
            {
                $group: {
                    _id: "$ano",
                    total: { $sum: "$movimientos.cantidad" }
                }
            }
        ],
        cb
    );*/
};

anoSchema.statics.totalIngresos = async function(ano) {
    const resultado = await this.aggregate([
        { $match: { ano: parseInt(ano) } },
        { $unwind: "$movimientos" },
        {
            $lookup: {
                from: "categorias",
                localField: "movimientos.categoria",
                foreignField: "_id",
                as: "categoria_doc"
            }
        },
        { $unwind: "$categoria_doc" },
        { $match: { "categoria_doc.ingreso": true } },
        {
            $group: {
                _id: "$ano",
                total: { $sum: "$movimientos.cantidad" }
            }
        }
    ]);

    const total = resultado.length > 0 ? resultado[0].total.toString() : 0;
    return total;
};

anoSchema.statics.totalGastos = async function(ano) {
    const resultado = await this.aggregate([
        { $match: { ano: parseInt(ano) } },
        { $unwind: "$movimientos" },
        {
            $lookup: {
                from: "categorias",
                localField: "movimientos.categoria",
                foreignField: "_id",
                as: "categoria_doc"
            }
        },
        { $unwind: "$categoria_doc" },
        { $match: { "categoria_doc.ingreso": false } },
        {
            $group: {
                _id: "$ano",
                total: { $sum: "$movimientos.cantidad" }
            }
        }
    ]);
    const total = resultado.length > 0 ? resultado[0].total.toString() : 0;
    return total;
};

module.exports = mongoose.model("Ano", anoSchema);
