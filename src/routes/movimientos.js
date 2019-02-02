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
        console.log(newMovimiento);
        await newMovimiento.save();
        
    }
    
    


    res.send('ok');
});

module.exports = router;