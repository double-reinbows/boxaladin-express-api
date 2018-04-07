const router = require('express').Router()

const auth = require('../helpers/auth')
const user = require('../controller_cms/user')
const transaction = require('../controller_cms/transaction')
const win = require('../controller_cms/win')
const gamerule = require('../controller_cms/gamerule')
const key = require('../controller_cms/key')
const xendit = require('../controller_cms/xendit')

router.get('/', auth.isLogin, auth.isAdmin, user.getAll)
router.get('/phone', auth.isLogin, auth.isAdmin, user.getUserWithPhone)
router.get('/balance', auth.isLogin, auth.isAdmin, xendit.balance)

router.post('/addkey', auth.isLogin, auth.isAdmin, key.addKey )
router.post('/removekey', auth.isLogin, auth.isAdmin, key.removeKey)

router.get('/transaction', auth.isLogin, auth.isAdmin, transaction.all)

router.get('/freetransaction', auth.isLogin, auth.isAdmin, transaction.allFree)
router.get('/win', auth.isLogin, auth.isAdmin, win.all)
router.get('/gamerule', auth.isLogin, auth.isAdmin, gamerule.all)

router.post('/login', user.login)
router.post('/create', auth.isLogin, auth.isSuperadmin ,user.create)

router.put('/gamerule/:id', auth.isLogin, auth.isAdmin, gamerule.update)

module.exports = router
