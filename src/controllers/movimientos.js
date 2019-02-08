const Ano = require("../models/Ano");
const helpers = require("../routes/helpers/helpers");
const Categoria = require("../models/Categoria");
const utils = require("../utils/helpers");

exports.getMovimientos = async (req, res, next) => {
    try {
        const ano = await Ano.findOne({ ano: req.params.anoId }).populate(
            "movimientos.categoria"
        );
        const totalIngresos = await Ano.totalIngresos(req.params.anoId);
        const totalGastos = await Ano.totalGastos(req.params.anoId);
        


        return res.render("anos/ano", {
            ano,
            movimientos: ano.movimientos,
            listaAnos: await helpers.listaAnos(),
            categorias: await helpers.listaCategorias(),
            resumen: {
                saldoActual: utils.obtenSaldo(
                    ano.saldoinicial.toString(),
                    totalIngresos,
                    totalGastos
                ),
                totalIngresos: totalIngresos,
                totalGastos: totalGastos
            },
            path: '/movimientos'
        });
    } catch (error) {
        console.log(error);
        req.flash("errors_msg", "Ha Sucedido Un Error");
        return res.redirect("/anos");
    }
};

exports.getMovimientosIngresos = async (req, res, next) => {
    try {
        const ano = await Ano.findOne({ ano: parseInt(req.params.anoId) }).populate(
            "movimientos.categoria"
        );

        const totalIngresos = await Ano.totalIngresos(req.params.anoId);
        const totalGastos = await Ano.totalGastos(req.params.anoId);

        return res.render("movimientos/ingresos-gastos", {
            ano,
            movimientos: ano.movimientos,
            listaAnos: await helpers.listaAnos(),
            categorias: await helpers.listaCategorias(),
            resumen: {
                saldoActual: utils.obtenSaldo(
                    ano.saldoinicial.toString(),
                    totalIngresos,
                    totalGastos
                ),
                totalIngresos: totalIngresos,
                totalGastos: totalGastos
            },
            path: '/movimientos',
            detalleMovimientos: true,
            ingresos: true ,
        });

    } catch (error) {
        console.log(error);
        req.flash("errors_msg", "Ha Sucedido Un Error");
        return res.redirect("/anos");
    }
}

exports.getMovimientosGastos = async (req, res, next) => {
    try {
        const ano = await Ano.findOne({ ano: parseInt(req.params.anoId) }).populate(
            "movimientos.categoria"
        );

        const totalIngresos = await Ano.totalIngresos(req.params.anoId);
        const totalGastos = await Ano.totalGastos(req.params.anoId);

        return res.render("movimientos/ingresos-gastos", {
            ano,
            movimientos: ano.movimientos,
            listaAnos: await helpers.listaAnos(),
            categorias: await helpers.listaCategorias(),
            resumen: {
                saldoActual: utils.obtenSaldo(
                    ano.saldoinicial.toString(),
                    totalIngresos,
                    totalGastos
                ),
                totalIngresos: totalIngresos,
                totalGastos: totalGastos
            },
            path: '/movimientos',
            detalleMovimientos: true,
            ingresos: false ,
        });

    } catch (error) {
        console.log(error);
        req.flash("errors_msg", "Ha Sucedido Un Error");
        return res.redirect("/anos");
    }
}

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
            await ano.save();
            const totalIngresos = await Ano.totalIngresos(ano.ano);
            const totalGastos = await Ano.totalGastos(ano.ano);
            const dt = {
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
                }
            };
            return res.send(dt);
        }
    } catch (err) {
        console.log(err);
        res.send("fallo");
    }
};
