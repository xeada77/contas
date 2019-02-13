const Ano = require("../models/Ano");
const helpers = require("../routes/helpers/helpers");

exports.getApiData = async (req, res, next) => {
    try {
        const ingresoPorCategoria = await Ano.aggregate([
            { $match: { ano: parseInt(req.params.anoId) } },
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
                    _id: {
                        codigo: "$categoria_doc.codigo",
                        nombre: "$categoria_doc.nombre"
                    },
                    total: { $sum: "$movimientos.cantidad" }
                }
            }
        ]);

        const gastoPorCategoria = await Ano.aggregate([
            { $match: { ano: parseInt(req.params.anoId) } },
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
                    _id: {
                        codigo: "$categoria_doc.codigo",
                        nombre: "$categoria_doc.nombre"
                    },
                    total: { $sum: "$movimientos.cantidad" }
                }
            }
        ]);

        return res.json({ ingresoPorCategoria, gastoPorCategoria });
    } catch (error) {
        console.log(error.message);
        return res.send("fail");
    }
};
