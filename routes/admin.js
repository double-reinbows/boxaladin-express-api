const router = require('express').Router()

const user = require('../controller_cms/user')
const transaction = require('../controller_cms/transaction')
const auth = require('../helpers/auth')

router.get('/', user.getAll)
router.get('/phone', user.getPhone)
router.get('/transaction', auth.isLogin, auth.isAdmin, transaction.all)
router.post('/login', user.login)
router.post('/create', auth.isLogin, auth.isSuperadmin ,user.create)

module.exports = router
