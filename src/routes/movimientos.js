const router = require("express").Router();

const movimientosController = require("../controllers/movimientos");



router.get(
    "/movimientos/:anoid",
    movimientosController.getMovimientos);

router.post(
    "/movimientos/:anoid/addmovimiento",
    movimientosController.postAddMovimiento
);

module.exports = router;
