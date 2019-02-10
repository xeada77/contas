const Ano = require("../models/Ano");
const helpers = require("../routes/helpers/helpers");

const remanenteId = '5c49be3c2205160e04089265';

// Devuelve la pagina con todos los años almacenados
exports.getAnos = async (req, res, next) => {
    res.render("anos", {
        listaAnos: await helpers.listaAnos(),
        errors: res.locals.errors_msg,
        path: '/anos'
    });
};

// Renderiza la pagina para crear un nuevo año
exports.getNewAno = async (req, res) => {
    res.render("anos/novo-ano", {
        opcionesAnos: helpers.opcionesAnos(),
        listaAnos: await helpers.listaAnos(),
        path: '/anos'
    });
};

// Acceso a la pantalla de edicion del año con los datos cargados
exports.getEditAno = (req, res, next) => {
    /* Se valida el año, primero si es un entero y si es asi se comprueba 
        que exista en la base de datos*/
    req.checkParams("anoid", "Introduzca un valor de año correcto.").isInt();
    if (!req.validationErrors()) {
        req.checkParams("anoid", "No existe el año en la base de datos")
            .not()
            .existeAno();
    }

    /* Con el resultado de la validacion se responde con un formulario o si     falla se redirige a la pagina de los años */
    req.asyncValidationErrors()
        .then(async () => {
            const ano = await Ano.findOne({ ano: req.params.anoid });
            res.render("anos/edit-ano", {
                ano,
                opcionesAnos: helpers.opcionesAnos(),
                listaAnos: await helpers.listaAnos(),
                path: '/anos'
            });
        })
        .catch(errors => {
            errors.forEach(error => {
                req.flash("errors_msg", error.msg);
            });
            res.redirect("/anos");
        });
};

exports.postNewAno = (req, res, next) => {
    req.check("saldoinicial", "El formato del saldo no es correcto.").matches(
        /^[0-9]+(\.[0-9]{1,2})?$/
    );
    req.check("ano", "Introduzca un valor de año correcto.").isInt();
    req.check("ano", "El año ya existe en la base de datos").existeAno();

    req.asyncValidationErrors()
        .then(async resp => {
            const newAno = new Ano({
                ano: parseInt(req.body.ano),
                saldoinicial: parseFloat(req.body.saldoinicial)
            });
            newAno.movimientos.push({
                fecha: new Date(parseInt(req.body.ano), 0, 1),
                concepto: 'Incorporacion Remanente Año Anterior',
                cantidad: parseFloat(req.body.saldoinicial),
                categoria: remanenteId
            });
            try {
                await newAno.save();
                req.flash(
                    "success_msg",
                    "El año ha sido creado satisfactoriamente."
                );
                return res.redirect("/anos");
            } catch (errs) {
                console.log(errs);
                return res.send("Algo Falló");
            }
        })
        .catch(async errors_msg => {
            console.log(errors_msg);
            const ano = {
                ano: req.body.ano,
                saldoinicial: req.body.saldoinicial
            };
            const validation = { ano: true, saldoinicial: true };
            errors_msg.forEach(validationErr => {
                validation[validationErr.param] = false;
            });

            res.render("anos/novo-ano", {
                ano,
                opcionesAnos: helpers.opcionesAnos(),
                listaAnos: await helpers.listaAnos(),
                errors_msg,
                validation,
                editAno: false,
                path: '/anos'
            });
        });
};

exports.putEditAno = async (req, res, next) => {
    const getAno = await Ano.findById(req.body.anoId);
    const putAno = await Ano.findOne({ ano: req.body.ano });

    if (putAno) {
        if (getAno.id !== putAno.id) {
            req.check(
                "ano",
                "El año ya existe en la base de datos"
            ).existeAno();
        }
    }

    req.checkBody(
        "saldoinicial",
        "El formato del saldo no es correcto."
    ).matches(/^[0-9]+(\.[0-9]{1,2})?$/);

    req.asyncValidationErrors()
        .then(() => {
            Ano.findByIdAndUpdate(req.body.anoId, {
                ano: req.body.ano,
                saldoinicial: req.body.saldoinicial
            })
                .then(anoActualizado => {
                    req.flash(
                        "success_msg",
                        "El año ha sido editado satisfactoriamente."
                    );
                    return res.redirect("/anos");
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(async errors => {
            console.log(errors);
            //const ano = await Ano.findById(req.body.anoId);
            const validation = { ano: true, saldoinicial: true };
            errors.forEach(validationErr => {
                validation[validationErr.param] = false;
            });
            return res.render("anos/edit-ano", {
                ano: {
                    ano: req.body.ano,
                    saldoinicial: req.body.saldoinicial,
                    id: req.body.anoId
                },
                opcionesAnos: helpers.opcionesAnos(),
                listaAnos: await helpers.listaAnos(),
                errors_msg: errors,
                validation,
                getAno: getAno,
                path: '/anos'
            });
        });
};

exports.postDeleteAno = async (req, res, next) => {
    try {
        const ano = await Ano.findByIdAndRemove(req.body.anoId);
        //await Movimiento.deleteMany({ ano: ano._id });
        return res.redirect("/anos");
    } catch (error) {
        console.log(error);
        return res.redirect("/anos");
    }
};
