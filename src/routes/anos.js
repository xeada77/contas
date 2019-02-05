const router = require("express").Router();

const anosController = require("../controllers/anos");



router.get("/anos", anosController.getAnos);
router.get("/anos/new", anosController.getNewAno);
router.get("/anos/edit/:anoid", anosController.getEditAno);

router.post("/anos/new", anosController.postNewAno);
router.put("/anos/edit/", anosController.putEditAno);
router.post("/anos/delete/", anosController.postDeleteAno);

module.exports = router;
