const router = require('express').Router()
const auth = require('../helpers/auth')
const cmsProduct = require('../controller_cms/product')

router.put('/product/:id',auth.isAdmin, cmsProduct.update)
router.post('/product',auth.isAdmin, cmsProduct.create)
router.delete('/product/:id',auth.isAdmin, cmsProduct.destroy)

module.exports = router
