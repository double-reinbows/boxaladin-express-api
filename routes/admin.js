const router = require('express').Router()

const user = require('../controller_cms/user')
const auth = require('../helpers/auth')

router.get('/', user.getAll)
router.get('/phone', user.getPhone)
router.post('/login', user.login)
router.post('/create', auth.isLogin, auth.isSuperadmin ,user.create)

module.exports = router
