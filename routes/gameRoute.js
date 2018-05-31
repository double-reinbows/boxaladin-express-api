const router = require('express').Router();

const gameController = require('../controller/gameController');

router.get('/', gameController.play);
// router.get('/increase', lose.increase)

module.exports = router;
