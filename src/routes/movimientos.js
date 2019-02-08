const router = require("express").Router();

const movimientosController = require("../controllers/movimientos");

router.get("/movimientos/:anoId", movimientosController.getMovimientos);

router.get(
    "/movimientos/:anoId/ingresos",
    movimientosController.getMovimientosIngresos
);

router.get(
    "/movimientos/:anoId/gastos",
    movimientosController.getMovimientosGastos
);

router.post(
    "/movimientos/:anoId/addmovimiento",
    movimientosController.postAddMovimiento
);

module.exports = router;
