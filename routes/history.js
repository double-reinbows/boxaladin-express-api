const router = require('express').Router()

const history = require('../controller/history')

router.get('/key', history.keyHistory)

module.exports = router
