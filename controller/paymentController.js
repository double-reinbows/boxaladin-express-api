const payment = require('../models').payment;
const transaction = require('../models').transaction;
const jwt = require('jsonwebtoken')
const axios = require ('axios')
const db = require('../models')
const moment = require('moment')
const bankCode = require('../helpers/bankCode')
const product = require('../helpers/findProduct')

module.exports = {
  createInvoice(req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    db.payment.create({
      invoiceId: "null",
      xenditId: 'null',
      status: "PENDING",
      amount: req.body.amount,
      availableBanks: "null",
      availableretail: "null",
      expiredAt: new Date()
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
        },{
          where: {
            id: req.body.productId
          }
        })

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
          description: product.productName
        },
      })
      .then(({data}) => {
        const banksArr_Obj = data.available_banks
        const banksStr = JSON.stringify(banksArr_Obj)
        let retailArr_Obj = ''
        {data.available_retail_outlets ? (retailArr_Obj = data.available_retail_outlets[0].payment_code) : (retailArr_Obj= 'ALFAMART SEDANG TIDAK BISA DIGUNAKAN')}
        db.payment.update({
          invoiceId: data.id,
          xenditId: newId,
          availableBanks: banksStr,
          availableretail: retailArr_Obj,
          expiredAt: data.expiry_date
        },{
          where:{
            id: dataPayment.id
          }
        }),

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
    })
    .catch(err => console.log(err))
  },

  async createInvoiceV2(req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    const check = await product.findProductBought(req, res)
    if (check.message === 'product not active'){
      return res.send('product not active')
    } else if (check.message === 'product not found'){
      return res.send('product not found')
    }
    const productData = check.product
    db.payment.create({
      invoiceId: "null",
      xenditId: 'null',
      status: "PENDING",
      amount: req.body.amount,
      availableBanks: "null",
      availableretail: "null",
      expiredAt: new Date()
    })
    .then(async dataPayment => {
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
          description: productData.productName
        },
      })
      .then(({data}) => {
        const banksArr_Obj = data.available_banks
        const banksStr = JSON.stringify(banksArr_Obj)
        let retailArr_Obj = ''
        {data.available_retail_outlets ? (retailArr_Obj = data.available_retail_outlets[0].payment_code) : (retailArr_Obj= 'ALFAMART SEDANG TIDAK BISA DIGUNAKAN')}
        db.payment.update({
          invoiceId: data.id,
          xenditId: newId,
          availableBanks: banksStr,
          availableretail: retailArr_Obj,
          expiredAt: data.expiry_date
        },{
          where:{
            id: dataPayment.id
          }
        }),

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
    })
    .catch(err => console.log(err))
  },

  retrieveInvoice(req, res) {
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
    // .catch(error => res.status(400).send(error));
  },

  createVirtualAccount(req, res) {
    const isodate = moment().utcOffset(0).add(12, 'hours').toISOString()
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    console.log(req.body)
    return db.payment.create({
      invoiceId: "null",
      xenditId: 'null',
      status: "PENDING",
      amount: req.body.amount,
      availableBanks: "null",
      availableretail: "null",
      expiredAt: new Date()
    })
    .then(async dataPayment => {
      const newId = 'P' + '-' +decoded.id + '-' + dataPayment.id
      const product = await db.product.findOne({
        where: {
          id: req.body.productId
        }
      })
        db.product.update({
          unpaid: product.unpaid + 1,
          noInvoice: product.noInvoice - 1
        },{
          where: {
            id: req.body.productId
          }
        })

      db.virtualAccount.findOne({
        where: {
          userId: decoded.id,
          bankCode: req.body.bankCode
        }
      })
      .then(result => {
        let va = ''
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
            name: 'Pt Boxaladin AsiaPasific ',
            is_closed: true,
            expected_amount: req.body.amount,
            virtual_account_number: va,
            is_single_use : true,
            expiration_date: isodate
          }
        })
        .then( dataResponse => {
          const data = dataResponse.data
          db.payment.update({
            invoiceId: data.id,
            xenditId: newId,
            availableBanks: data.account_number,
            expiredAt: data.expiration_date
          }, {
            where:{
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
              return db.transaction.create({
                paymentId: dataPayment.id,
                productId: req.body.productId,
                userId: decoded.id ,
                pulsaId: newId,
                aladinPrice: req.body.amount,
                status: "PENDING",
                number: req.body.phoneNumber,
                description: product.productName,
                virtualId : dataVirtual.id,
              })
              .then( dataFinal => {
                res.send({
                  dataFinal,
                  status: 200,
                  amount : req.body.amount,
                  message: 'new va'
                })
              })
            })
          } else {
            console.log('existing va')
            return db.transaction.create({
              paymentId: dataPayment.id,
              productId: req.body.productId,
              userId: decoded.id ,
              pulsaId: newId,
              aladinPrice: req.body.amount,
              status: "PENDING",
              number: req.body.phoneNumber,
              description: product.productName,
              virtualId : result.id,
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
    .catch(err => console.log(err));
  },

  async createVirtualAccountV2(req, res) {
    const isodate = moment().utcOffset(0).add(12, 'hours').toISOString()
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    const check = await product.findProductBought(req, res)
    if (check.message === 'product not active'){
      return res.send('product not active')
    } else if (check.message === 'product not found'){
      return res.send('product not found')
    }
    const productData = check.product
    return db.payment.create({
      invoiceId: "null",
      xenditId: 'null',
      status: "PENDING",
      amount: req.body.amount,
      availableBanks: "null",
      availableretail: "null",
      expiredAt: new Date()
    })
    .then(async dataPayment => {
      const newId = 'P' + '-' +decoded.id + '-' + dataPayment.id
      db.virtualAccount.findOne({
        where: {
          userId: decoded.id,
          bankCode: req.body.bankCode
        }
      })
      .then(result => {
        let va = ''
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
            name: 'Pt Boxaladin AsiaPasific',
            is_closed: true,
            expected_amount: req.body.amount,
            virtual_account_number: va,
            is_single_use : true,
            expiration_date: isodate
          }
        })
        .then( async dataResponse => {
          const data = dataResponse.data
          db.payment.update({
            invoiceId: data.id,
            xenditId: newId,
            availableBanks: data.account_number,
            expiredAt: data.expiration_date
          }, {
            where:{
              id: dataPayment.id
            }
          })

          const price = await db.pulsaPrice.findOne({
            where: {
              id: req.body.priceId
            }
          })
          db.product.update({
            unpaid: productData.unpaid + 1
          }, {
            where: {
              id: productData.id
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

          if (!result){
            console.log('create new va')
            return db.virtualAccount.create({
              userId: decoded.id,
              bankCode: req.body.bankCode,
              virtualAccountNumber: va
            })
            .then(dataVirtual => {
              return db.transaction.create({
                paymentId: dataPayment.id,
                productId: productData.id,
                userId: decoded.id ,
                pulsaId: newId,
                aladinPrice: req.body.amount,
                status: "PENDING",
                number: req.body.phoneNumber,
                description: productData.productName,
                virtualId : dataVirtual.id,
              })
              .then( dataFinal => {
                res.send({
                  dataFinal,
                  status: 200,
                  amount : req.body.amount,
                  message: 'new va'
                })
              })
            })
          } else {
            console.log('existing va')
            return db.transaction.create({
              paymentId: dataPayment.id,
              productId: productData.id,
              userId: decoded.id ,
              pulsaId: newId,
              aladinPrice: req.body.amount,
              status: "PENDING",
              number: req.body.phoneNumber,
              description: productData.productName,
              virtualId : result.id,
            })
            .then( dataFinal => {
              res.send({
                dataFinal,
                status: 200,
                message: 'existing va'
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
    .catch(err => console.log(err));
  },
  /*
   * This function takes a bank name, looks it up in the virtualAccounts table and then attempts to
   * find Xendit's invoice id in the latest corresponding row in the payments table. It then end-dates
   * the virtual account in Xendit's system and if successful, sets the status of the payment row to
   * 'CANCELLED'.
   */
  closeVirtualAccount(req, res) {
    let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
    let getVA = db.virtualAccount.findOne({
      where: {
        userId: decoded.id,
        bankCode: req.body.bank,
      }
    });
    let now = new Date; //get date now
    now.setDate(now.getDate() - 1); //minus one day
    getVA.then(VAccount => {
      if (!VAccount) { return res.send('VA Not Found'); }
      //find the latest payment with status=PENDING
      let getInvoiceP = db.payment.findAll({
        limit: 1,
        where: {
          availableBanks: {ilike: '%' + VAccount.dataValues.virtualAccountNumber},
          status: 'PENDING',
        },
        order: [ [ 'createdAt', 'DESC' ]]
      });
      getInvoiceP.then(data => {
        if (!Array.isArray(data) || !data.length) { return res.send('Invoice not found'); }
        const row = data[0].dataValues.id; //remember the id to update status if Xendit succeeds
        console.log('HALO', data[0].dataValues.invoiceId)
        let xenditP = axios({
          method: 'PATCH',
          url: `https://api.xendit.co/callback_virtual_accounts/${data[0].dataValues.invoiceId}`,
          headers: {
            authorization: process.env.XENDIT_AUTHORIZATION,
          },
          data: {
            expiration_date: now,
            expected_amount: data[0].dataValues.amount,
          },
        });
        xenditP.then(data => {
          if (data.status === 200) {
            db.payment.update({
              status: 'CANCELLED',
            }, {
              where: {
                id: row,
              }
            }).catch(err => {console.log('UPDATE FAIL', err)});
            return res.send('Fixed VA closed');
          }
        })
      })
    }).catch(err => { console.log(err) })
  }
}
