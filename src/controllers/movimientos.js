const Ano = require("../models/Ano");
const helpers = require("../routes/helpers/helpers");
const Categoria = require("../models/Categoria");

exports.getMovimientos = async (req, res, next) => {
    try {
        const ano = await Ano.findOne({ ano: req.params.anoid }).populate(
            "movimientos.categoria"
        );
        const movimientos = ano.movimientos;

        return res.render("anos/ano", {
            ano,
            movimientos,
            listaAnos: await helpers.listaAnos(),
            categorias: await helpers.listaCategorias()
        });
    } catch (error) {
        console.log(error);
        req.flash("errors_msg", "Ha Sucedido Un Error");
        return res.redirect("/anos");
    }
};

exports.postAddMovimiento = async (req, res, next) => {
    const { fecha, concepto, cantidad, categoriaId, anoId } = req.body;
    try {
        const categoria = await Categoria.findById(categoriaId);
        const ano = await Ano.findById(anoId);
        if (ano) {
            ano.movimientos.push({ fecha, concepto, cantidad, categoria: categoriaId });
            await ano.save();
            const dt = {
                codigoCategoria: categoria.codigo,
                cantidad: cantidad,
                concepto: concepto
            };
            return res.send(dt);
        }
    } catch (err) {
        console.log(err);
        res.send('fallo');
    }
};