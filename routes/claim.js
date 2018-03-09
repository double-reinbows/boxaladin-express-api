const router = require('express').Router()

const claim = require('../controller/claim')

router.get('/', claim.all)
router.get('/user', claim.allByUser)

router.post('/', claim.create)

module.exports = router
