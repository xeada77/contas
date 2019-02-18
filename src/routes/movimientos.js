const router = require("express").Router();

const movimientosController = require("../controllers/movimientos");


// GET Requests
router.get(
    "/movimientos/:anoId",
    movimientosController.getDatosMovimientos, movimientosController.getMovimientos);

router.get(
    '/movimientos/:anoId/edit/:movimientoId', movimientosController.getEditMovimiento);


router.get('/movimientos/:anoId/:trimestre',
    movimientosController.getDatosMovimientos,
    movimientosController.getMovimientos);

// Other Requests
router.post(
    "/movimientos/:anoId/addmovimiento",
    movimientosController.postAddMovimiento,
);

router.put(
    '/movimientos/:anoId/edit/:movimientoId',
    movimientosController.putEditMovimiento
);

router.delete(
    '/movimientos/:anoId/delete/:movimientoId',
    movimientosController.deleteMovimiento
);

module.exports = router;
