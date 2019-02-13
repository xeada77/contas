const router = require("express").Router();

const apiController = require('../controllers/api');

router.get('/api/data/:anoId', apiController.getApiData);

module.exports = router;