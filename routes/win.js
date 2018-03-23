const router = require('express').Router()

const win = require('../controller/win')

router.get('/', win.all)
router.get('/user', win.byUser)
router.get('/:id', win.byId)

router.put('/resettoken/:id', win.resetToken)

router.post('/', win.create)
router.post('/claimfreepulsa', win.claimFreePulsa)

module.exports = router
