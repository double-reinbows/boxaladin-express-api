const router = require('express').Router()

const gamecount = require('../controller/gamecount')

router.get('/', gamecount.all)
// router.get('/increase', lose.increase)

module.exports = router
