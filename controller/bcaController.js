const payment = require('../models').payment;
const transaction = require('../models').transaction;
const jwt = require('jsonwebtoken')
const axios = require('axios')
const db = require('../models')
const moment = require('moment')
const bankCode = require('../helpers/bankCode')
const product = require('../helpers/findProduct')


module.exports = {
  bcaPulsaInvoice(req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    db.payment.create({
      invoiceId: 'BCA',
      xenditId: 'BCA',
      status: "PENDING",
      amount: req.body.amount,
      availableBanks: 7140322355,
      availableretail: "BCA",
      expiredAt: moment().add(12, 'hours').toISOString()
      })
      .then(async dataPayment => {
        const newId = 'P' + '-' + decoded.id + '-' + dataPayment.id
        const check = await product.findProductBought(req, res)
        if (check.message === 'product not active'){
          return res.send('product not active')
        } else if (check.message === 'product not found'){
          return res.send('product not found')
        }
        const productData = check.product
        const price = await db.pulsaPrice.findOne({
          where: {
            id: req.body.priceId
          }
        })
        db.pulsaPrice.update({
          unpaid: price.unpaid + 1,
          noInvoice: price.noInvoice - 1
        },{
          where: {
            id: req.body.priceId
          }
        })

        db.transaction.create({
          paymentId: dataPayment.id,
          productId: productData.id,
          userId: decoded.id,
          pulsaId: newId,
          number: req.body.phoneNumber,
          status: "PENDING",
          aladinPrice: req.body.amount,
          description: productData.productName,
          virtualId: 0
        })
        .then(dataFinal => {
          res.send({
            dataFinal,
            status: 200
          })
        })
      })
      .catch(err => console.log(err))
  },

  bcaPaketdataInvoice(req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    db.payment.create({
      invoiceId: 'BCA',
      xenditId: 'BCA',
      status: "PENDING",
      amount: req.body.amount,
      availableBanks: 7140322355,
      availableretail: "BCA",
      expiredAt: moment().add(12, 'hours').toISOString()
      })
      .then(async dataPayment => {
        const newId = 'P' + '-' + decoded.id + '-' + dataPayment.id
        const product = await db.product.findOne({
          where: {
            id: req.body.productId
          }
        })
        db.product.update({
          unpaid: product.unpaid + 1,
          noInvoice: product.noInvoice - 1
        }, {
          where: {
            id: req.body.productId
          }
        })
        db.payment.update({
          xenditId: newId
          }, {
          where: {
            id: dataPayment.id
          }
        })

        db.transaction.create({
          paymentId: dataPayment.id,
          productId: req.body.productId,
          userId: decoded.id,
          pulsaId: newId,
          number: req.body.phoneNumber,
          status: "PENDING",
          aladinPrice: req.body.amount,
          description: product.productName,
          virtualId: 0
        })
        .then(dataFinal => {
          res.send({
            dataFinal,
            status: 200
          })
        })
      })
      .catch(err => console.log(err))
  },

  bcaKey(req, res){
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    db.key.findById(req.body.keyId)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: 'Key Not Found',
        });
      }
      return db.payment.create ({
        invoiceId: "BCA",
        xenditId: 'BCA',
        status: "PENDING",
        amount: data.price,
        availableBanks: 7140322355,
        availableretail: "BCA",
        expiredAt: moment().add(12, 'hours').toISOString()
      })
      .then((dataPayment) => {
        const newId = 'T' + '-' + decoded.id + ('-') + dataPayment.id
        db.topup.create({
          paymentId: dataPayment.id,
          userId: decoded.id,
          keyId: req.body.keyId,
          xenditId: newId,
          status: 'PENDING',
          virtualId: 0
        })
        .then(dataFinal => {
          db.payment.update({
            xenditId: newId,
          }, {
            where:{
              id: dataPayment.id
            }
          })
          res.send({
            dataFinal,
            status: 200
          })
        })
      })
    })
    .catch(error => console.log(error));
  },

  bcaWallet(req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    db.user.findOne({
      where: {
        id: decoded.id
      }
    })
    .then(dataUser => {
      if ( dataUser.wallet + req.body.amount > 2000000) {
        return res.send('maksimum limit wallet')
      }
      if (req.body.amount >= 200000) {
        console.log('create invoice')
        db.payment.create({
          invoiceId: 'BCA',
          xenditId: 'BCA',
          status: "PENDING",
          amount: req.body.amount,
          availableBanks: 7140322355,
          availableretail: "BCA",
          expiredAt: moment().add(12, 'hours').toISOString()
        })
        .then(dataResponse => {
          const newId = 'W' + '-' +decoded.id + '-' + dataResponse.id
          let retailArr_Obj = ''

          db.payment.update({
            xenditId: newId
          }, {
            where:{
              id: dataResponse.id
            }
          });

          db.walletLog.create({
            userId: decoded.id,
            paymentId: dataResponse.id,
            virtualId: 0,
            amount: req.body.amount,
            status: 'PENDING'
          })
          .then(dataFinal => {
            return res.send({
              dataFinal,
              status: 200,
            })
          })
        })
      } else {
        res.send('saldo limited')
      }
    })
    .catch(err => console.log(err));
  }
}
