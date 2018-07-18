const router = require('express').Router()
const auth = require('../helpers/auth')
const cmsProduct = require('../controller_cms/product')
const transaction = require('../controller_cms/transaction')
const freeTransaction = require('../controller_cms/transaction')
const payments = require('../controller_cms/payment')

router.put('/product/:id',auth.isAdmin, cmsProduct.update)
router.post('/product',auth.isAdmin, cmsProduct.create)
router.delete('/product/:id',auth.isAdmin, cmsProduct.destroy)
router.get('/free', freeTransaction.allFree)
router.get('/topup', freeTransaction.allTopup)
router.get('/payment',auth.isAdmin, payments.updatePaymentExpired)

module.exports = router
