const express = require('express');
const router = express.Router();

const ctrl = require('../controller/indexCtrl')
const phoneCtrl = require('../controller/otpCtrl')
const phoneHelper = require('../helpers/phone')

router.get('/', ctrl.getAll)
router.get('/emailVerification', ctrl.verifyEmail)
router.get('/phoneNumbers', phoneCtrl.getPhoneByUser)

router.post('/phoneVerification', phoneCtrl.verifyPhoneNumber)
router.post('/signin', ctrl.signin)

/**
 * Endpoint post user data/info ketika signup
 */
router.post('/signup', ctrl.signup)
router.post('/phonenumber', phoneHelper.checkDuplicate, phoneHelper.checkAlready, phoneCtrl.postPhoneNumber)

module.exports = router;
