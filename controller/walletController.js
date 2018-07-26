const moment = require('moment')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const db = require('../models')
const bankCode = require('../helpers/bankCode')
const pulsa = require('./pulsa')

module.exports = {
  alfamartWallet(req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    db.user.findOne({
      where: {
        id: decoded.id
      }
    })
    .then(dataUser => {
      // if (decoded.emailVerified == false) {
      //   return res.send('not verified user' )
      // }
      if ( dataUser.wallet + req.body.amount >= 2000000) {
        return res.send('maksimum limit wallet')
      }
      if (req.body.amount <= 2000000 && req.body.amount >= 200000) {
        console.log('create invoice')
        db.payment.create({
          invoiceId: "null",
          xenditId: 'null',
          status: "PENDING",
          amount: req.body.amount,
          availableBanks: "null",
          availableretail: "null",
          expiredAt: new Date()
        })
        .then(dataPayment => {
          const newId = 'W' + '-' +decoded.id + '-' + dataPayment.id
          axios({
            method: 'POST',
            url: `https://api.xendit.co/v2/invoices`,
            headers: {
              authorization: process.env.XENDIT_AUTHORIZATION
            },
            data: {
              external_id: newId,
              amount: req.body.amount,
              payer_email: decoded.email,
              description: "TopUp Wallet"
            },
          })
          .then(dataResponse => {
            const data = dataResponse.data
            console.log('data', data)
            let retailArr_Obj = ''
            {data.available_retail_outlets ? (retailArr_Obj = data.available_retail_outlets[0].payment_code) : (retailArr_Obj= 'ALFAMART SEDANG TIDAK BISA DIGUNAKAN')}
            return db.payment.update({
              invoiceId: data.id,
              xenditId: newId,
              availableBanks: JSON.stringify(data.available_banks),
              availableretail: retailArr_Obj,
              expiredAt: data.expiry_date
            }, {
              where:{
                id: dataPayment.id
              }
            }),
            db.walletLog.create({
              userId: decoded.id,
              paymentId: dataPayment.id,
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
        })
      } else {
        res.send('saldo limited')
      }
    })
    .catch(err => console.log(err));
  },

  fixedvaWallet(req, res) {
    const isodate = moment().add(12, 'hours').toISOString();
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    db.user.findOne({
      where: {
        id: decoded.id
      }
    })
    .then(dataUser => {
    //   if (decoded.emailVerified === false) {
    //   return res.send('not verified user')
    // }
    if ( dataUser.wallet + req.body.amount > 2000000) {
      return res.send('maksimum limit wallet')
    }
    if (req.body.amount <= 2000000 && req.body.amount >= 200000) {
      console.log('create invoice')
      return db.payment.create({
        invoiceId: "null",
        xenditId: 'null',
        status: "PENDING",
        amount: req.body.amount,
        availableBanks: "null",
        availableretail: "null",
        expiredAt: new Date()
      })
      .then(dataPayment => {
        const newId = 'W' + '-' +decoded.id + '-' + dataPayment.id
        return db.virtualAccount.findOne({
          where: {
            userId: decoded.id,
            bankCode: req.body.bankCode
          }
        })
        .then(result => {
          let va =''
          {!result ? (va = bankCode(req.body.bankCode, decoded).toString()) : (va = result.dataValues.virtualAccountNumber)}
          axios({
            method: 'POST',
            url: `https://api.xendit.co/callback_virtual_accounts`,
            headers: {
              authorization: process.env.XENDIT_AUTHORIZATION
            },
            data: {
              external_id: newId,
              bank_code: req.body.bankCode,
              name: 'Pt Boxaladin AsiaPasific Topup Wallet',
              is_closed: true,
              expected_amount: req.body.amount,
              virtual_account_number: va,
              is_single_use : true,
              expiration_date: isodate
            }
          })
          .then( dataResponse => {
            const data = dataResponse.data
            console.log(data)
            let promise = db.payment.update({
              invoiceId: data.id,
              xenditId: newId,
              availableBanks: data.account_number,
              expiredAt: data.expiration_date
            }, {
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
                return db.walletLog.create({
                  userId: decoded.id,
                  paymentId: dataPayment.id,
                  virtualId: dataVirtual.id,
                  amount: req.body.amount,
                  status: 'PENDING'
                })
                .then( dataFinal => {
                  res.send({
                    dataFinal,
                    status: 200,
                  })
                })
              })
            } else {
              console.log('existing va')
              return db.walletLog.create({
                userId: decoded.id,
                paymentId: dataPayment.id,
                virtualId: result.dataValues.id,
                amount: req.body.amount,
                status: 'PENDING'
              })
              .then( dataFinal => {
                res.send({
                  dataFinal,
                  status: 200,
                })
              })
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
    } else {
      res.send('saldo limited')
    }
    })
    .catch(err => console.log(err));
  },

  walletBuyKey(req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    // if (decoded.emailVerified == false) {
    //   return res.send({ msg: 'not verified user' })
    // }
    //reI
    db.key.findById(req.body.keyId)
    .then(dataKey => {
      if (!dataKey) {
        return res.status(404).send({
          message: 'Key Not Found',
        });
      }
      if (decoded.wallet < dataKey.price) {//check User has enough money in JWT
        return res.send({
          message: 'saldo tidak mencukupi',
          wallet: decoded.wallet
        })
      } else if(decoded.wallet >= dataKey.price) {
        return db.user.findOne({
          where: {
            id: decoded.id
          }
        })
        .then(dataUser => {
          if (dataUser.wallet >= dataKey.price){
            return db.user.update({
              wallet: dataUser.wallet - dataKey.price,
              aladinKeys: dataUser.aladinKeys + dataKey.keyAmount
            }, {
              where: {
                id: decoded.id
              },
              returning: true,
              plain: true
            })
            .then( updateUser => {
              const user = updateUser[1].dataValues
              const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                  typedEmail: user.typedEmail,
                  emailVerified: user.emailVerified,
                  wallet: user.wallet,
                  key: user.aladinKeys,
                  coin: user.coin
                },
                process.env.JWT_SECRET, {
                  expiresIn: "7 days"
                })
              return db.payment.create ({
                invoiceId: "wallet",
                xenditId: 'null',
                status: "PAID",
                amount: dataKey.price,
                availableBanks: "wallet",
                availableretail: "wallet",
                expiredAt: new Date(),
              })
              .then(dataPayment => {
                const newId = 'W' + '-' + decoded.id + '-' + dataPayment.id

                return db.payment.update({
                  xenditId: newId,
                  invoiceId: 'wallet' + '-' + dataPayment.id
                },{
                  where:{
                    id: dataPayment.id
                  }
                }),
                db.topup.create({
                paymentId: dataPayment.id,
                userId: decoded.id,
                keyId: req.body.keyId,
                xenditId: newId,
                status: 'PAID',
                virtualId: 0
                })
                .then(dataTopUp => {
                  res.send({
                    message: 'topup sukses',
                    dataTopUp,
                    token: token
                  })
                })
              })
            })
          } else {
            return res.send({
              message: 'saldo tidak mencukupi',
              wallet: decoded.wallet
            })
          }
        })
      }
    })
    .catch(error => console.log(error));
  },

  walletBuyPulsa(req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    db.aladinkeyLog.findAll({
      where: {
        userId: decoded.id,
        productId: req.body.productId
      },
      order: [ [ 'createdAt', 'DESC' ]]
    })
    .then(dataAladinkeyLog => {
      const price = dataAladinkeyLog[0].dataValues.priceAfter //[0] to take 1st row

      if (decoded.wallet < price) {//check User has enough money in JWT
        return res.send({
          message: 'saldo tidak mencukupi',
          wallet: decoded.wallet
        })
      } else if (decoded.wallet >= price){
        return db.user.findOne({
          where: {
            id: decoded.id
          }
        })
        .then(dataUser => {
          if ( dataUser.wallet >= price) {
            return db.payment.create({
            invoiceId: "wallet",
            xenditId: 'null',
            status: "PAID",
            amount: price,
            availableBanks: "wallet",
            availableretail: "wallet",
            expiredAt: new Date()
          })
          .then(dataPayment => {
            const newId = 'W' + '-' +decoded.id + '-' + dataPayment.id

            db.payment.update({
            xenditId: newId,
            invoiceId: 'wallet' + '-' + dataPayment.id
            }, {
              where: {
                id: dataPayment.id
              }
            })

            return db.product.findOne({
              where: {
                id: req.body.productId
              }
            })
            .then(dataProduct => {
              return db.transaction.create({
                paymentId: dataPayment.id,
                productId: req.body.productId,
                userId: decoded.id,
                pulsaId: newId,
                number: req.body.phoneNumber,
                status: "PAID",
                aladinPrice: price,
                virtualId: 0,
                description: dataProduct.productName
              })
              .then(dataFinal => {
              console.log('panggil function pulsa');
              pulsa.pulsaWallet(req, res,price, dataUser.dataValues, dataFinal.dataValues, dataProduct.dataValues)
              res.send({
                dataFinal,
                status: 200,
                message: 'sukses pulsa'
              })
                return db.product.update({
                  sold: dataProduct.sold + 1
                }, {
                  where: {
                    id: req.body.productId
                  }
                })
              })
            })
          })
          }
          else {
            return res.send({
              message: 'saldo tidak mencukupi',
              wallet: dataUser.wallet
            })
          }
        })
      }
    })
    .catch(err => console.log(err))
  },

  walletStatus(req, res){
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    db.walletLog.findAll({
      where: {
        userId: decoded.id,
      }, include: [
        { model: db.payment },
        { model: db.virtualAccount }
      ],
      order: [['id', 'ASC']],
    })
    .then(dataWallet => {
      res.send(dataWallet)
    })
    .catch(err => console.log(err))
  },

  byId(req, res) {
    db.walletLog.findOne({
        where: {
          id: parseInt(req.params.id)
        },
        include: [
          { model: db.payment },
          { model: db.virtualAccount }
        ]
      })
      .then(data => {
        res.send(data)
      })
      .catch(err => res.status(400).send(err))
  },
}
