const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')

const paymentController = require('../controller/paymentController')
const callbackController = require('../controller/callback')
const pulsaController = require('../controller/pulsa')
const transactionController = require('../controller/transaction')
const creditCardController = require('../controller/creditCard')
const aladinkeyController = require('../controller/aladinKey')
const aladinKeyLogController = require('../controller/aladinKeyLogController')

const ctrl = require('../controller/indexCtrl')
const phoneCtrl = require('../controller/phoneCtrl')
const otpCtrl = require('../controller/otp')
const phoneHelper = require('../helpers/phone')
const service = require('../controller/layanan')

const categoryController = require('../controller/category')
const brandController = require('../controller/brand')
const productController = require('../controller/product')

const firebaseHelper = require('../helpers/firebase')
const biddingController = require('../controller/biddingController')

const forgotPassword = require('../controller/forgotPassword')
const auth = require('../helpers/auth')

const gameRuleController = require('../controller/gamerule');
const gameController = require('../controller/gameController');

const walletController = require('../controller/walletController')

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

router.post('/unlockPrice', biddingController.decreaseAladinPrice)
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
router.post('/virtualaccount', auth.isVerified, paymentController.createVirtualAccount)
router.post('/payment', auth.isVerified, paymentController.createInvoice)
router.get('/payment/:id', paymentController.retrieveInvoice)
// router.get('/status/:id/:invoice', paymentController.updateStatus)
router.post('/callbackurl', callbackController.createCallbackXendit)
router.post('/callbackfixed', callbackController.callBackFixedXendit)
router.post('/creditCard', creditCardController.createCreditCard)
router.delete('/virtualaccount', auth.isLogin, paymentController.closeVirtualAccount);
// router.post('/cancelinvoice', paymentController.cancelInvoice)
router.post('/fixedwallet', auth.isVerified, walletController.fixedvaWallet)
router.post('/alfawallet', auth.isVerified, walletController.alfamartWallet)
router.post('/walletkey', auth.isVerified, walletController.walletBuyKey)
router.post('/walletpulsa', auth.isVerified, walletController.walletBuyPulsa)
router.get('/walletstatus', walletController.walletStatus)
router.get('/walletstatus/:id', walletController.byId)
// ---------------------------------------

router.post('/topupKey', auth.isVerified, aladinkeyController.topUpKeys)
router.post('/topupva', auth.isVerified, aladinkeyController.createVirtualAccount )
router.get('/voucheraladinkey', aladinkeyController.all)
router.get('/topup/user', aladinkeyController.allByUser)
router.get('/topup/userpending', aladinkeyController.allPendingByUser)
router.get('/topup/:id', aladinkeyController.byId)
router.post('/creditCardTopup', creditCardController.createCreditCardTopup)

// ------------------pulsa routes----------------------------
router.post('/pulsa', pulsaController.pulsa)
router.post('/pulsacallbackurl', callbackController.createCallbackPulsa)
// -----------------------------------------------------------

// ------------------transaction routes----------------------------
router.get('/transaction/userPending', transactionController.allPendingByUser)
router.get('/transaction/user', transactionController.allByUser)
router.get('/transaction/:id', transactionController.byId)
// -----------------------------------------------------------

router.get('/api/category', categoryController.list);
router.get('/api/category/:id', categoryController.retrieve);
router.post('/api/category', auth.isLogin, auth.isSuperadmin, categoryController.create);
router.put('/api/category/:id', auth.isLogin, auth.isSuperadmin, categoryController.update);
router.delete('/api/category/:id', auth.isLogin, auth.isSuperadmin, categoryController.destroy);

router.get('/api/brand', brandController.list);
router.get('/api/brand/:id', brandController.retrieve);
router.post('/api/brand', auth.isLogin, auth.isSuperadmin, brandController.create);
router.put('/api/brand/:id', auth.isLogin, auth.isSuperadmin, brandController.update);
router.delete('/api/brand/:id', auth.isLogin, auth.isSuperadmin, brandController.destroy);

router.get('/api/product/filter', productController.filter);
router.get('/api/product', productController.list);
router.get('/api/product/:id', productController.listProductActive)
// router.get('/api/product/:id', productController.retrieve);
router.post('/api/product', auth.isLogin, auth.isSuperadmin, productController.create);
router.put('/api/product/:id', auth.isLogin, auth.isSuperadmin, productController.update);
router.delete('/api/product/:id', auth.isLogin, auth.isSuperadmin, productController.destroy);

router.get('/gamerules', gameRuleController.all);
router.get('/game', gameController.play);

router.put('/logopen', auth.isLogin, aladinKeyLogController.increaseOpen)
router.put('/lognoinvoice/:id', aladinKeyLogController.increaseNoInvoice)
router.post('/logbid' , auth.isLogin, aladinKeyLogController.logBid)
router.post('/watching', productController.updateWatch)

router.post('/tesva', paymentController.tesVa)
module.exports = router;
