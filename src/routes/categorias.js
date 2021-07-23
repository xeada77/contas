const router = require("express").Router();

const Categoria = require("../models/Categoria");

const helpers = require("./helpers/helpers");

router.get("/categorias", async (req, res) => {
    const categorias = await Categoria.find().lean();
    res.render("categorias", {
        listaAnos: await helpers.listaAnos(),
        categorias,
        path: '/categorias'
    });
});

router.get("/categorias/add", async (req, res) => {
    res.render("categorias/nova-categoria", {
        listaAnos: await helpers.listaAnos(),
        path: '/categorias'
    });
});

router.post("/categorias/add", async (req, res) => {
    console.log(helpers.esIngreso(req.body.codigo));
    const categoria = new Categoria({
        nombre: req.body.nombre,
        codigo: req.body.codigo.toLowerCase(),
        ingreso: helpers.esIngreso(req.body.codigo)
    });
    console.log(categoria);
    await categoria.save();
    res.redirect("/categorias");
});

module.exports = router;
