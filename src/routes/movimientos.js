const router = require("express").Router();

const movimientosController = require("../controllers/movimientos");

router.get(
    "/movimientos/:anoId",
    movimientosController.getDatosMovimientos, movimientosController.getMovimientos);

router.get(
    "/movimientos/:anoId/ingresos",
    movimientosController.getDatosMovimientos,
    movimientosController.getMovimientosIngresos
);

router.get(
    "/movimientos/:anoId/gastos",
    movimientosController.getDatosMovimientos,
    movimientosController.getMovimientosGastos
);

router.get(
    '/movimientos/:anoId/edit/:movimientoId', movimientosController.getEditMovimiento);

router.post(
    "/movimientos/:anoId/addmovimiento",
    movimientosController.postAddMovimiento
);

router.put(
    '/movimientos/:anoId/edit/:movimientoId',
    movimientosController.putEditMovimiento
);

module.exports = router;
