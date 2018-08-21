const payment = require('../models').payment;
const transaction = require('../models').transaction;
const topup = require('../models').topup;
const axios = require ('axios')
const db = require('../models')
const bankCode = require('../helpers/bankCode')
const jwt = require('jsonwebtoken')
const moment = require('moment')
let invoice = ""
let banksArr_Obj = ""
let banksStr = ""

module.exports = {
  //Called when a User wants to purchase AladinKeys
  topUpKeys(req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    // if (decoded.emailVerified == false) {
    //   return res.send('not verified user' )
    // }
    db.key.findById(req.body.keyId)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: 'Key Not Found',
        });
      }
      return db.payment.create ({
        invoiceId: "null",
        xenditId: 'null',
        status: "PENDING",
        amount: data.price,
        availableBanks: "null",
        availableretail: "null",
        expiredAt: new Date()
      })
      .then((dataPayment) => {
        const newId = 'T' + '-' + decoded.id + ('-') + dataPayment.id
        console.log('newid', newId)

        let xenditP = axios({
          method: 'POST',
          url: `https://api.xendit.co/v2/invoices`,
          headers: {
            authorization: process.env.XENDIT_AUTHORIZATION
          },
          data: {
            external_id: newId,
            amount: dataPayment.amount,
            payer_email: decoded.email,
            description: "TopUp Aladin Key"
          },
        });

        let topupP = db.topup.create({
          paymentId: dataPayment.id,
          userId: decoded.id,
          keyId: req.body.keyId,
          xenditId: newId,
          status: 'PENDING',
          virtualId: 0
        })

        //when Xendit responds, update payment
        xenditP.then((data) => {
          let dataAxios = data.data
          console.log('dataaxios', dataAxios)
          banksArr_Obj = dataAxios.available_banks
          banksStr = JSON.stringify(banksArr_Obj)
          {dataAxios.available_retail_outlets ? (retailArr_Obj = dataAxios.available_retail_outlets[0].payment_code) : (retailArr_Obj= 'ALFAMART SEDANG TIDAK BISA DIGUNAKAN')}

          //update payment with Xendit details
          db.payment.update({
            invoiceId: dataAxios.id,
            xenditId: newId,
            availableBanks: banksStr,
            availableretail: retailArr_Obj,
            expiredAt: dataAxios.expiry_date
          },{
            where:{
              id: dataPayment.id
            }
          })

          //when topup row created, send response
          topupP.then(dataFinal => {
            return res.status(200).send({
              dataFinal,
              status : 200,
            });
          })
        })
      })
    })
    .catch(error => console.log(error));
  },

  all(req, res) {
    db.key.findAll(
      {order: [['id', 'ASC']]}
    )
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

  allPendingByUser(req, res) {
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    return topup
      .findAll({
        where: {
          userId: decoded.id
        },
        order: [['id', 'ASC']],

        include: [
          { model: db.payment },
          { model: db.key },
          { model: db.virtualAccount }
        ]
      })
      .then(data => {
        let dataPending = data.filter(data => data.payment.status == 'PENDING')
        return res.send(dataPending)
      }).catch(err => res.status(400).send(err))
  },

  allByUser(req, res) {
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    return topup
      .findAll({
        where: {
          userId: decoded.id
        },
        order: [['id', 'ASC']],
        include: [
          { model: db.payment },
          { model: db.key },
          { model: db.virtualAccount }
        ]
      })
      .then(data => {
        return res.send(data)
      }).catch(err => res.status(400).send(err))
  },

  byId(req, res) {
    return topup
      .findOne({
        where: {
          id: parseInt(req.params.id)
        },
        include: [
          { model: db.payment },
          { model: db.key },
          { model: db.virtualAccount }
        ]
      })
      .then(data => {
        res.send(data)
      })
      .catch(err => res.status(400).send(err))
  },

  createVirtualAccount(req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    const isodate = moment().utcOffset(0).add(12, 'hours').toISOString()
    // if (decoded.emailVerified == false) {
    //   return res.send({ msg: 'not verified user' })
    // }

    return db.key.findById(req.body.keyId)
    .then(data => {
      console.log('balikan data', data);
      if (!data) {
        //Non-existent key ID
        return res.status(404).send({
          message: 'Key Not Found',
        });
      }
      //create payment
      return db.payment.create ({
        invoiceId: "null",
        xenditId: 'null',
        status: "PENDING",
        amount: data.price,
        availableBanks: "null",
        availableretail: "null",
        expiredAt: new Date()
    })
    .then(dataPayment => {
      const newId = 'T' + '-' + decoded.id + ('-') + dataPayment.id
      return db.virtualAccount.findOne({
        where: {
          userId: decoded.id,
          bankCode: req.body.bankCode
        }
      })
      .then( result => {
        let va =''
        {!result ? (va = bankCode(req.body.bankCode, decoded).toString()) : (va = result.dataValues.virtualAccountNumber)}
        //Create invoice/fixed-va with Xendit
        axios({
          method: 'POST',
          url: `https://api.xendit.co/callback_virtual_accounts`,
          headers: {
            authorization: process.env.XENDIT_AUTHORIZATION
          },
          data: {
            external_id: newId,
            bank_code: req.body.bankCode,
            name: 'Pt Boxaladin AsiaPasific TopUp Aladin Key',
            is_closed: true,
            expected_amount: dataPayment.amount,
            virtual_account_number: va,
            is_single_use: true,
            expiration_date: isodate
          },
        })
        .then( dataResponse => {
          const data = dataResponse.data
          console.log(data)
          db.payment.update({
            invoiceId: data.id,
            xenditId: newId,
            availableBanks: data.account_number,
            expiredAt: data.expiration_date
          },{
            where: {
              id: dataPayment.id
            }
          })
          if (!result){
            console.log('create new va')
            return db.virtualAccount.create({
              userId: decoded.id,
              bankCode: req.body.bankCode,
              virtualAccountNumber: va
            })
            .then(dataVirtual => {
              return db.topup.create({
                paymentId: dataPayment.id,
                userId: decoded.id,
                keyId: req.body.keyId,
                xenditId: newId,
                virtualId: dataVirtual.id,
                status: "PENDING"
              })
              .then( dataFinal => {
                res.send({
                  dataFinal,
                  status : 200,
                  message: 'new va'
                })
              });
            })
          } else {
            console.log('existing va')
            return db.topup.create({
              paymentId: dataPayment.id,
              userId: decoded.id,
              keyId: req.body.keyId,
              xenditId: newId,
              virtualId: result.dataValues.id,
              status: "PENDING"
            })
            .then( dataFinal => {
              res.send({
                dataFinal,
                status : 200,
                message: 'existing va'
              })
            });
          }
        })
        .catch(error => {
          if (error.response.data.error_code === 'DUPLICATE_CALLBACK_VIRTUAL_ACCOUNT_ERROR'){
            db.payment.destroy({
              where: {
                id: dataPayment.id
              }
            })
            res.send(error.response.data)
          } else {
            res.send(error.response.data)
          }
        });
      })
    })
  })
  .catch(err => res.status(400).send(err));
}
};
