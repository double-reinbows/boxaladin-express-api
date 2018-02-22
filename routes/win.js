const router = require('express').Router()

const win = require('../controller/win')

router.get('/', win.all)

router.post('/', win.create)

module.exports = router
