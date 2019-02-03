const router = require("express").Router();


const anosController = require("../controllers/anos");
const Ano = require("../models/Ano");
const Movimiento = require("../models/Movimiento");

const listaAnos = async () => {
    const anos = await Ano.find().sort({ ano: 1 });
    return anos;
};

router.get("/anos", anosController.getAnos);
router.get("/anos/new", anosController.getNewAno);
router.get("/anos/edit/:anoid", anosController.getEditAno);

router.post("/anos/new", anosController.postNewAno);




// Editar el año

router.put("/anos/edit/", anosController.putEditAno);

router.post("/anos/delete/", async (req, res) => {
    console.log(req.body);
    await Ano.findOneAndDelete(
        { ano: req.body.anoId },
        async (err, respuesta) => {
            if (err) {
                console.log(err);
                res.send("error");
            } else {
                const borrados = await Movimiento.deleteMany(
                    { ano: respuesta },
                    err => console.log(err)
                );
                console.log(borrados);
                res.send("ok");
            }
        }
    );
});

module.exports = router;
