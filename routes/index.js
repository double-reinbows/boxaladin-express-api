const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')

const paymentController = require('../controller/payment')
const callbackController = require('../controller/callback')
const pulsaController = require('../controller/pulsa')
const transactionController = require('../controller/transaction')
const creditCardController = require('../controller/creditCard')
const topUpController = require('../controller/aladinKey')

const ctrl = require('../controller/indexCtrl')
const phoneCtrl = require('../controller/phoneCtrl')
const otpCtrl = require('../controller/otp')
const phoneHelper = require('../helpers/phone')
const service = require('../controller/layanan')

const categoryController = require('../controller/category')
const brandController = require('../controller/brand')
const productController = require('../controller/product')

const firebaseHelper = require('../helpers/firebase')
const aladinController = require('../controller/aladin')

const forgotPassword = require('../controller/forgotPassword')
const auth = require('../helpers/auth')

router.get('/sandbox', (req, res) => {
  let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
  console.log(' --- ', decoded)
  return res.send({
    message: 'sandbox endpoint',
    data: decoded
  })
})

router.post('/forgotpassword', forgotPassword.requestViaEmail)
router.post('/resetpassword', forgotPassword.reset)

router.post('/unlockPrice', aladinController.decreaseAladinPrice)
router.get('/firebase', firebaseHelper.syncToFirebase)

router.get("/", auth.isLogin, auth.isSuperadmin, ctrl.getAll);
router.post("/signin", ctrl.signin);
router.post("/signup", ctrl.signup);


router.get("/emailVerification", ctrl.verifyEmail);
router.post('/resendemailverification', ctrl.resendEmailVerification)
router.post('/serviceemail', service.sendEmailService)
//-------------------phone routes-------------------------
router.get("/phoneNumbers", phoneCtrl.getPhoneByUser);
router.get("/userwithphone/:id", phoneCtrl.getAllPhone);
router.post('/phonenumber' , phoneCtrl.postPhoneNumber)
router.put('/phone/:id', phoneHelper.checkDuplicate, phoneCtrl.changePhone)
router.delete('/phone/:id', phoneCtrl.removePhone)

router.post("/changePrimary", phoneCtrl.changePrimary);
router.post("/smsVerification", phoneCtrl.sendSmsVerification);
router.post("/phoneVerification", phoneCtrl.verifyPhoneNumber);
router.post('/otp', phoneCtrl.otp)
router.post('/signupverification', phoneCtrl.signUpVerify)
router.post('/olduserotp', otpCtrl.oldUserSentotp)
router.post('/olduserverification', phoneCtrl.oldUserVerify)

//-------------------xendit routes-------------------------
router.post('/payment', paymentController.createInvoice)
router.get('/payment/:id', paymentController.retrieveInvoice)
// router.get('/status/:id/:invoice', paymentController.updateStatus)
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
// -----------------------------------------------------------

// ------------------transaction routes----------------------------
router.post('/transaction', transactionController.create)
router.get('/transaction/userPending', transactionController.allPendingByUser)
router.get('/transaction/user', transactionController.allByUser)
router.get('/transaction/:id', transactionController.byId)
// -----------------------------------------------------------

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

module.exports = router;
