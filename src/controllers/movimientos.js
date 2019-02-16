const Ano = require("../models/Ano");
const helpers = require("../routes/helpers/helpers");
const Categoria = require("../models/Categoria");
const utils = require("../utils/helpers");
const { Types } = require("mongoose");
const moment = require("moment");

exports.getDatosMovimientos = async (req, res, next) => {
    try {
        const ano = await Ano.findOne({ ano: req.params.anoId }).populate(
            "movimientos.categoria"
        );
        const totalIngresos = await Ano.totalIngresos(req.params.anoId);
        const totalGastos = await Ano.totalGastos(req.params.anoId);
        res.locals.datos = { ano, totalIngresos, totalGastos };
        return next();
    } catch (error) {
        console.log(error.message);
        req.flash("errors_msg", "Ha Sucedido Un Error Middle.");
        return res.redirect("/anos");
    }
};



exports.getMovimientos = async (req, res, next) => {
    try {
        return res.render("anos/ano", {
            ano: res.locals.datos.ano,
            movimientos: res.locals.datos.ano.movimientos,
            listaAnos: await helpers.listaAnos(),
            categorias: await helpers.listaCategorias(),
            resumen: {
                saldoActual: utils.obtenSaldo(
                    res.locals.datos.ano.saldoinicial.toString(),
                    res.locals.datos.totalIngresos,
                    res.locals.datos.totalGastos
                ),
                totalIngresos: res.locals.datos.totalIngresos,
                totalGastos: res.locals.datos.totalGastos
            },
            path: "/movimientos",
            detalleMovimientos: false,
        });
    } catch (error) {
        console.log(error.message);
        req.flash("errors_msg", "Ha Sucedido Un Error");
        return res.redirect("/anos");
    }
};

exports.getMovimientosIngresos = async (req, res, next) => {
    try {
        return res.render("movimientos/ingresos-gastos", {
            ano: res.locals.datos.ano,
            movimientos: res.locals.datos.ano.movimientos,
            listaAnos: await helpers.listaAnos(),
            categorias: await helpers.listaCategorias(),
            resumen: {
                saldoActual: utils.obtenSaldo(
                    res.locals.datos.ano.saldoinicial.toString(),
                    res.locals.datos.totalIngresos,
                    res.locals.datos.totalGastos
                ),
                totalIngresos: res.locals.datos.totalIngresos,
                totalGastos: res.locals.datos.totalGastos
            },
            path: "/movimientos",
            detalleMovimientos: true,
            ingresos: true
        });
    } catch (error) {
        console.log(error.message);
        req.flash("errors_msg", "Ha Sucedido Un Error");
        return res.redirect("/anos");
    }
};

exports.getMovimientosGastos = async (req, res, next) => {
    try {
        return res.render("movimientos/ingresos-gastos", {
            ano: res.locals.datos.ano,
            movimientos: res.locals.datos.ano.movimientos,
            listaAnos: await helpers.listaAnos(),
            categorias: await helpers.listaCategorias(),
            resumen: {
                saldoActual: utils.obtenSaldo(
                    res.locals.datos.ano.saldoinicial.toString(),
                    res.locals.datos.totalIngresos,
                    res.locals.datos.totalGastos
                ),
                totalIngresos: res.locals.datos.totalIngresos,
                totalGastos: res.locals.datos.totalGastos
            },
            path: "/movimientos",
            detalleMovimientos: true,
            ingresos: false
        });
    } catch (error) {
        console.log(error.message);
        req.flash("errors_msg", "Ha Sucedido Un Error");
        return res.redirect("/anos");
    }
};

exports.getEditMovimiento = async (req, res, next) => {
    const movimientoId = Types.ObjectId(req.params.movimientoId);
    try {
        const movimiento = await Ano.aggregate([
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
            { $match: { "movimientos._id": movimientoId } }
        ]);
        //console.log(movimiento);
        const movimientoFormated = {
            anoId: req.params.anoId,
            concepto: movimiento[0].movimientos.concepto,
            cantidad: movimiento[0].movimientos.cantidad.toString(),
            fecha: movimiento[0].movimientos.fecha,
            id: movimiento[0].movimientos._id,
            categoriaNombre: movimiento[0].categoria_doc[0].nombre,
            categoriaId: movimiento[0].categoria_doc[0]._id,
            categoriaCodigo: movimiento[0].categoria_doc[0].codigo
        };

        return res.render("movimientos/edit-movimiento", {
            movimiento: movimientoFormated,
            listaAnos: await helpers.listaAnos(),
            categorias: await helpers.listaCategorias()
        });
    } catch (error) {
        console.log(error.message);
        req.flash(
            "errors_msg",
            "Ha Sucedido Un Error Al intentar acceder al movimiento."
        );
        return res.redirect("/movimientos/" + req.params.anoId);
    }
};

exports.postAddMovimiento = async (req, res, next) => {
    const { fecha, concepto, cantidad, categoriaId, anoId } = req.body;
    try {
        const categoria = await Categoria.findById(categoriaId);
        const ano = await Ano.findById(anoId);
        if (ano) {
            ano.movimientos.push({
                fecha,
                concepto,
                cantidad,
                categoria: categoriaId
            });
            const ultimoMovimiento = ano.movimientos[ano.movimientos.length - 1];
            await ano.save();
            const totalIngresos = await Ano.totalIngresos(ano.ano);
            const totalGastos = await Ano.totalGastos(ano.ano);
            const dt = {
                ano: ano,
                esIngreso: categoria.ingreso,
                codigoCategoria: categoria.codigo,
                cantidad: cantidad,
                concepto: concepto,
                resumen: {
                    saldoInicial: ano.saldoinicial.toString(),
                    saldoActual: utils.obtenSaldo(
                        ano.saldoinicial.toString(),
                        totalIngresos,
                        totalGastos
                    ),
                    totalIngresos: totalIngresos,
                    totalGastos: totalGastos
                },
                movimientoId: ultimoMovimiento._id
            };
            return res.send(dt);
        }
    } catch (err) {
        console.log(err.message);
        res.send("fallo");
    }
};

exports.putEditMovimiento = async (req, res, next) => {
    const movimientoId = Types.ObjectId(req.params.movimientoId);
    const cat = req.body.categoria.split("-");
    const fecha = moment.utc(req.body.fecha, "DD-MM-YYYY").toDate();

    try {
        const categoria = await Categoria.findOne({ codigo: cat[0].trim() });
        await Ano.updateOne(
            {
                ano: parseInt(req.params.anoId),
                "movimientos._id": movimientoId
            },
            {
                $set: {
                    "movimientos.$.concepto": req.body.concepto,
                    "movimientos.$.categoria": categoria,
                    "movimientos.$.cantidad": parseFloat(req.body.cantidad),
                    "movimientos.$.fecha": fecha
                }
            }
        );
        req.flash(
            "success_msg",
            "El movimiento ha sido actualizado satisfactoriamente."
        );
        return res.redirect("/movimientos/" + req.params.anoId);
    } catch (error) {
        console.log(error.message);
        req.flash(
            "errors_msg",
            "Ha Sucedido Un Error Al intentar acceder al movimiento."
        );
        return res.redirect("/movimientos/" + req.params.anoId);
    }
};

exports.deleteMovimiento = async (req, res, next) => {
    console.log(req.params);
    const movimientoId = Types.ObjectId(req.params.movimientoId);
    try {
        await Ano.findOneAndUpdate(
            { "ano": parseInt(req.params.anoId) },
            { $pull: { "movimientos": { "_id": movimientoId } } }
        );
        req.flash(
            "success_msg",
            "El movimiento ha sido eliminado correctamente."
        );
        return res.redirect('/movimientos/' + req.params.anoId);
        
    } catch (error) {
        console.log(error.message);
        req.flash(
            "errors_msg",
            "Ha sucedido un error al intentar eliminar el movimiento."
        );
        return res.redirect('/movimientos/' + req.params.anoId);
    }
}
