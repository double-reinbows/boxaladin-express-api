const express = require('express');
const router = express.Router();

const ctrl = require('../controller/indexCtrl')
const phoneCtrl = require('../controller/otpCtrl')

router.get('/', ctrl.getAll)
router.get('/emailVerification', ctrl.verifyEmail)

router.post('/signin', ctrl.signin)

/**
 * Endpoint post user data/info ketika signup
 */
router.post('/signup', ctrl.signup)
router.post('/phonenumber', phoneCtrl.postPhoneNumber)

module.exports = router;
