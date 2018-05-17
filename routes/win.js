const router = require('express').Router()
const auth = require('../helpers/auth')

const win = require('../controller/win')

router.get('/', auth.isLogin, auth.isSuperadmin, win.all)
router.get('/user', auth.isLogin, win.byUser)
router.get('/:id', auth.isLogin, win.byId)
router.get('/checkcoin/user', auth.isLogin, win.checkCoinById)

// router.put('/resettoken/:id', win.resetToken)

router.post('/', auth.isLogin, win.create)
router.post('/claimfreepulsa', auth.isLogin, win.claimFreePulsa)

module.exports = router
