const router = require('express').Router();
const Ano = require('../models/Ano');
const Movimiento = require('../models/Movimiento');

const helpers = require('./helpers/helpers');




router.get('/movimientos/:anoid', async (req, res) => {

    const ano = await Ano.findOne({ ano: req.params.anoid });
    const movimientos = await Movimiento.find({ ano: ano }).populate('categoria').limit(5).sort({ fecha: 1 });
    

    res.render('anos/ano', {ano , movimientos, listaAnos: await helpers.listaAnos(), categorias: await helpers.listaCategorias()});
});

router.post('/movimientos/:anoid/addmovimiento', async (req, res) => {
    const { fecha, concepto, cantidad, categoria, anoId } = req.body;
    // console.log(req.body);
    const anoObj = await Ano.findById( anoId );
    if (anoObj) {
        const newMovimiento = new Movimiento({ fecha, concepto, cantidad, ano: anoId, categoria });
        const movimiento = await newMovimiento.save();
        const datos = await Movimiento.findById(movimiento.id).populate('categoria');
        const dt = { codigoCategoria: datos.categoria.codigo, cantidad: datos.cantidad.toString(), concepto: datos.concepto };
        return res.send(dt);
        
    }
    
    



});

module.exports = router;