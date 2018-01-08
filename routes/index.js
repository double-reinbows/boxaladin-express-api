const express = require('express');
const router = express.Router();

const ctrl = require('../controller/indexCtrl')

router.get('/', ctrl.getAll)

router.post('/signin', ctrl.signin)

/**
 * Endpoint post user data/info ketika signup
 */
router.post('/signup', ctrl.signup)

module.exports = router;
