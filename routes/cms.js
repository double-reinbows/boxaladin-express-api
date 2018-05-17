const router = require('express').Router()

const cmsProduct = require('../controller_cms/product')

router.put('/product/:id', cmsProduct.update)
router.post('/product', cmsProduct.create)
router.delete('/product/:id', cmsProduct.destroy)

module.exports = router
