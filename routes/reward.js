const router = require('express').Router()

const reward = require('../controller/reward')

router.get('/', reward.all)

router.post('/', reward.create)

module.exports = router
