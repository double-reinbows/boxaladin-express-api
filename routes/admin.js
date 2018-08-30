const router = require('express').Router()

const auth = require('../helpers/auth')
const user = require('../controller_cms/user')
const transaction = require('../controller_cms/transaction')
const win = require('../controller_cms/win')
const gamerule = require('../controller_cms/gamerule')
const xendit = require('../controller_cms/xendit')
const phoneCtrl = require('../controller/phoneCtrl')
const history = require('../controller_cms/history')
const cmsProduct = require('../controller_cms/product')
const payments = require('../controller_cms/payment')
const email = require('../controller_cms/emailUpdate')
const employee = require('../controller_cms/employeeController')
const chart = require('../controller_cms/chart')

router.post('/login', user.login)

router.get('/', auth.isLogin, auth.isSuperadmin, user.getAll)
router.post('/create', auth.isLogin, auth.isSuperadmin ,user.create)
router.post('/finduser', auth.isLogin, auth.isSuperadmin, user.findByEmail)
router.get('/user/finduser/:id', auth.isAdmin, user.findById)

router.get('/allPhone', auth.isLogin, auth.isSuperadmin, phoneCtrl.all);

router.post('/employee/user', auth.isAdmin, employee.createEmployee)
router.get('/employee', auth.isAdmin, employee.findAllEmployee)
router.delete('/employee/user/:id', auth.isAdmin, employee.deleteEmployee)

router.get('/balance', auth.isLogin, auth.isSuperadmin, xendit.balance)

router.get('/v2/transaction', auth.isLogin, auth.isAdmin, transaction.allv2)
router.get('/v2/topup', auth.isLogin, auth.isAdmin, transaction.allTopup)
router.get('/v2/wallet', auth.isLogin, auth.isAdmin, transaction.allWalletlog)
router.get('/freetransaction', auth.isLogin, auth.isSuperadmin, transaction.allFree)
router.post('/transaction/aladinkeys/:id', auth.isAdmin, transaction.updateAladinKeys)
router.post('/transaction/cashwallet/:id', auth.isAdmin, transaction.updateUserWallet)

router.get('/win', auth.isLogin, auth.isSuperadmin, win.all)

router.get('/gamerule', auth.isLogin, auth.isSuperadmin, gamerule.all)
router.put('/gamerule/:id', auth.isLogin, auth.isSuperadmin, gamerule.update)

router.get('/key', auth.isLogin, auth.isAdmin, history.keyHistory)
router.get('/pulsa', auth.isLogin, auth.isAdmin, history.pulsaHistory)
router.get('/openproduct', auth.isLogin, auth.isAdmin, history.openHistory)

router.put('/product/:id',auth.isAdmin, cmsProduct.update)
router.post('/product',auth.isAdmin, cmsProduct.create)
router.delete('/product/:id',auth.isAdmin, cmsProduct.destroy)
router.put('/active/:id', auth.isAdmin, cmsProduct.setActiveProduct)

router.get('/payment',auth.isAdmin, payments.updateFixedVA)
router.get('/invoice',auth.isAdmin, payments.updateNonFixedVA)

router.put('/emailupdate', auth.isAdmin, email.updateEmailStatus)
router.put('/user/edituser/:id', auth.isAdmin, email.editEmail)

router.post('/chart/alltransaction', auth.isAdmin, chart.chartAllTransaction)

module.exports = router
