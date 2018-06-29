const router = require('express').Router()

const auth = require('../helpers/auth')
const user = require('../controller_cms/user')
const transaction = require('../controller_cms/transaction')
const win = require('../controller_cms/win')
const gamerule = require('../controller_cms/gamerule')
const key = require('../controller_cms/key')
const xendit = require('../controller_cms/xendit')
const phoneCtrl = require('../controller/phoneCtrl')
const history = require('../controller_cms/history')

router.get('/', auth.isLogin, auth.isSuperadmin, user.getAll)
router.get('/phone', auth.isLogin, auth.isSuperadmin, user.getUserWithPhone)

router.get('/allPhone', auth.isLogin, auth.isSuperadmin, phoneCtrl.all);

router.get('/balance', auth.isLogin, auth.isSuperadmin, xendit.balance)
router.post('/finduser', auth.isLogin, auth.isSuperadmin, user.findUser)

router.post('/addkey', auth.isLogin, auth.isSuperadmin, key.addKey )
router.post('/removekey', auth.isLogin, auth.isSuperadmin, key.removeKey)

router.get('/transaction', auth.isLogin, auth.isSuperadmin, transaction.all)

router.get('/freetransaction', auth.isLogin, auth.isSuperadmin, transaction.allFree)
router.get('/win', auth.isLogin, auth.isSuperadmin, win.all)
router.get('/gamerule', auth.isLogin, auth.isSuperadmin, gamerule.all)

router.post('/login', user.login)
router.post('/create', auth.isLogin, auth.isSuperadmin ,user.create)

router.get('/key', auth.isLogin, auth.isAdmin, history.keyHistory)
router.get('/pulsa', auth.isLogin, auth.isAdmin, history.pulsaHistory)
router.get('/openproduct', auth.isLogin, auth.isAdmin, history.openHistory)

router.put('/gamerule/:id', auth.isLogin, auth.isSuperadmin, gamerule.update)

module.exports = router
