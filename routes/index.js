// const xmlparser = require('express-xml-bodyparser')
// const https = require ('https')
// const CircularJSON = require('circular-json')
// const axios = require ('axios')
// var convert = require('xml-js')
// const md5 = require('md5')
// var data2xml = require('data2xml');
// var convertxml = data2xml();
// var str2json = require('string-to-json');
// const xml = require("xml-parse");

const express = require('express');
const router = express.Router();

const xenditController = require('../controller/balance')
const paymentController = require('../controller/payment')
const callbackController = require('../controller/callback')
const pulsaController = require('../controller/pulsa')
const transactionController = require('../controller/transaction')
const creditCardController = require('../controller/creditCard')
const topUpController = require('../controller/aladinKey')

const ctrl = require('../controller/indexCtrl')
const phoneCtrl = require('../controller/otpCtrl')
const phoneHelper = require('../helpers/phone')

const categoryController = require('../controller/category')
const brandController = require('../controller/brand')
const productController = require('../controller/product')

const firebaseHelper = require('../helpers/firebase')
const aladinController = require('../controller/aladin')

router.post('/unlockPrice', aladinController.decreaseAladinPrice)
router.get('/firebase', firebaseHelper.syncToFirebase)

router.get('/allPhone', phoneCtrl.all)
router.get('/', ctrl.getAll)
router.get('/emailVerification', ctrl.verifyEmail)
router.get('/phoneNumbers', phoneCtrl.getPhoneByUser)
router.delete('/phone/:id', phoneCtrl.removePhone)

//-------------------xendit routes-------------------------
router.get('/balance', xenditController.balance)
router.post('/payment', paymentController.createInvoice)
router.get('/payment/:id', paymentController.retrieveInvoice)
router.get('/status/:id/:invoice', paymentController.updateStatus)
router.post('/callbackurl', callbackController.createCallbackXendit)
router.post('/creditCard', creditCardController.createCreditCard)
// ---------------------------------------

router.post('/topupKey', topUpController.topUpKeys)
router.get('/voucheraladinkey', topUpController.all)
router.get('/topup/user', topUpController.allByUser)
router.get('/topup/userpending', topUpController.allPendingByUser)
router.get('/topup/:id', topUpController.byId)
router.post('/creditCardTopup', creditCardController.createCreditCardTopup)

// ------------------pulsa routes----------------------------
router.post('/pulsa', pulsaController.pulsa)
router.post('/pulsacallbackurl', callbackController.createCallbackPulsa)
router.post('/pulsacallbackurldevelopment', callbackController.createCallbackPulsaDevelopment)
// -----------------------------------------------------------

// ------------------transaction routes----------------------------
router.post('/transaction', transactionController.create)
router.get('/transaction/userPending', transactionController.allPendingByUser)
router.get('/transaction/user', transactionController.allByUser)
router.get('/transaction/:id', transactionController.byId)
// -----------------------------------------------------------

router.post('/changePrimary', phoneCtrl.changePrimary)
router.post('/smsVerification', phoneCtrl.sendSmsVerification)
router.post('/phoneVerification', phoneCtrl.verifyPhoneNumber)
router.post('/signin', ctrl.signin)

/**
 * Endpoint post user data/info ketika signup
 */
router.post('/signup', ctrl.signup)
router.post('/phonenumber', phoneHelper.checkDuplicate, phoneHelper.checkAlready, phoneCtrl.postPhoneNumber)

router.put('/phone/:id', phoneHelper.checkDuplicate, phoneHelper.checkAlready, phoneCtrl.changePhone)


router.get('/api/category', categoryController.list);
router.get('/api/category/:id', categoryController.retrieve);
router.post('/api/category', categoryController.create);
router.put('/api/category/:id', categoryController.update);
router.delete('/api/category/:id', categoryController.destroy);

router.get('/api/brand', brandController.list);
router.get('/api/brand/:id', brandController.retrieve);
router.post('/api/brand', brandController.create);
router.put('/api/brand/:id', brandController.update);
router.delete('/api/brand/:id', brandController.destroy);

router.get('/api/product/filter', productController.filter);
router.get('/api/product', productController.list);
router.get('/api/product/:id', productController.retrieve);
router.post('/api/product', productController.create);
router.put('/api/product/:id', productController.update);
router.delete('/api/product/:id', productController.destroy);

// router.post('/xml', (req, res) => {
// var parsedXML = xml.parse(req.body);
// console.log("convertxml", parsedXML[2].childNodes[9].childNodes[0].text);
//  return res.send(parsedXML[2].childNodes[9].childNodes[0].text)

// })

module.exports = router;
