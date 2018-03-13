const payment = require('../models').payment;
const transaction = require('../models').transaction;
const jwt = require('jsonwebtoken')
const axios = require ('axios')
const db = require('../models')
let invoice = ""
let banksArr_Obj = ""
let banksStr = ""

module.exports = {
  createInvoice(req, res) {
    return payment
    .create({
      invoiceId: "null",
      status: "PENDING",
      amount: req.body.amount,
      availableBanks: "null",
    })
    .then(dataPayment => {
      let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
      db.transaction.create({
        paymentId: dataPayment.id,
        productId: req.body.productId,
        userId: decoded.id,
        number: req.body.phoneNumber,
        status: "PENDING",
        aladinPrice: req.body.amount
        })
        .then(dataTransaction => {
          console.log(dataTransaction.dataValues.productId)
          db.product.findOne({
            where:{
              id: dataTransaction.dataValues.productId
            }
          })
          .then((resultProduct) => {
            console.log(resultProduct.dataValues.productName.toString())
            console.log('AAAAAAAAAAAAAa', req.body.amount)
            let dataStrPaymentID = dataTransaction.dataValues.paymentId.toString()
            console.log(dataStrPaymentID)
            console.log(req.body.amount)
            console.log(decoded.email)
            console.log(resultProduct.dataValues.productName)
            axios({
              method: 'POST',
              url: `https://api.xendit.co/v2/invoices`,
              headers: {
                authorization: process.env.XENDIT_PRODUCTION_AUTHORIZATION
              },
              data: {
                external_id: dataStrPaymentID,
                amount: req.body.amount,
                payer_email: decoded.email,
                description: resultProduct.dataValues.productName
              },
            })
            .then(({data}) => {
              console.log('userAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', data)
              console.log('statusAAAAAAAAAAAAAAAAAAAAAAAAAAAA', data.status)
              invoice = data.id,
              banksArr_Obj = data.available_banks
              banksStr = JSON.stringify(banksArr_Obj)
              console.log('IDDDDDDDDDDDD', invoice)
              console.log (banksStr)
              console.log(dataPayment.id)
              db.payment.update({
                invoiceId: invoice,
                availableBanks: banksStr
              },{
                where:{
                  id: dataPayment.id
                }
              })
              .then((dataAxios)=>{
                db.transaction.findOne({
                  where: {
                    paymentId: dataPayment.id
                  }
                })
                .then(dataTransaksi => {
                  if (!dataTransaksi) {
                    return res.status(404).send({
                      message: 'Data Not Found',
                    });
                  }
                  return res.status(200).send(dataTransaksi);
                })
                .catch(error => res.status(400).send(error));
              })
              .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
          })
          .catch(err => res.status(400).console.log(err));
        })
        .catch(err => res.status(400).console.log(err));
      })
      .catch(err => res.status(400).console.log(err));
    },

    retrieveInvoice(req, res) {
      console.log("data", invoice)
      console.log("bank", banksStr)
      return payment
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'Payment Not Found',
          });
        }
        return res.status(200).send(data);
      })
      .catch(error => res.status(400).send(error));
    },


    createInvoice2(req, res) {
      axios({
        method: 'POST',
        url: `https://api.xendit.co/v2/invoices`,
        headers: {
          authorization: process.env.XENDIT_PRODUCTION_AUTHORIZATION
        },
        data: {
          external_id: req.body.externalId,
          amount: req.body.amount,
          payer_email: req.body.email,
          description: req.body.description
        },
      })
      .then(({data}) => {
        res.send(data),
        console.log(data)
      })
      .catch((error) => res.status(400).send(error));
}

}