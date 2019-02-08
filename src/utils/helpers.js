const Decimal = require('decimal.js');

exports.obtenSaldo = (saldo, ingresos, gastos) => {
    const i = new Decimal(ingresos);
    const g = new Decimal(gastos);
    const s = new Decimal(saldo);
    if (saldo) {
        return s.plus(i).minus(g).toString();
    } else {
        return i.minus(g).toString();
    }
}