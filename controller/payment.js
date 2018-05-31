const payment = require('../models').payment;
const transaction = require('../models').transaction;
const jwt = require('jsonwebtoken')
const axios = require ('axios')
const db = require('../models')
let invoice = ""
let banksArr_Obj = ""
let banksStr = ""
let retailArr_Obj = ""
let retailStr = ""

module.exports = {
  createInvoice(req, res) {
    return payment
    .create({
      invoiceId: "null",
      xenditId: 'null',
      status: "PENDING",
      amount: req.body.amount,
      availableBanks: "null",
      availableretail: "null"
    })
    .then(dataPayment => {
      let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
      return db.transaction.create({
        paymentId: dataPayment.id,
        productId: req.body.productId,
        userId: decoded.id,
        pulsaId: 'null',
        number: req.body.phoneNumber,
        status: "PENDING",
        aladinPrice: req.body.amount
        })
        .then(dataTransaction => {
          return db.product.findOne({
            where:{
              id: dataTransaction.dataValues.productId
            }
          })
          .then(resultProduct => {
            db.product.update({
              sold: resultProduct.sold + 1
            }, {
              where: {
                id: dataTransaction.dataValues.productId
              }
            })
            .then( productUpdate => {
              let newId = decoded.id + '-' + dataTransaction.dataValues.paymentId
              var productDescription = resultProduct.dataValues.productName
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
                  description: productDescription
                },
              })
              .then(({data}) => {
                console.log(data)
                invoice = data.id,
                banksArr_Obj = data.available_banks
                banksStr = JSON.stringify(banksArr_Obj)
                retailArr_Obj = data.available_retail_outlets[0].payment_code
                retailStr = JSON.stringify(retailArr_Obj)
                return db.payment.update({
                  invoiceId: invoice,
                  xenditId: newId,
                  availableBanks: banksStr,
                  availableretail: retailStr
                },{
                  where:{
                    id: dataPayment.id
                  }
                })
                .then((dataAxios) => {
                  return db.transaction.update({
                    description: productDescription,
                    pulsaId: newId
                  }, {
                    where: {
                      paymentId: dataPayment.id
                    }
                  })
                  .then((dataTransaksi => {
                    return db.transaction.findOne({
                      where: {
                        paymentId: dataPayment.id
                      }
                    })
                    .then(dataFinal => {
                      if (!dataFinal) {
                        return res.status(404).send({
                          message: 'Data Not Found'
                        });
                      }
                      return res.status(200).send(dataFinal);
                    })
                    .catch(error => res.status(400).send(error));
                  }))
                  .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
              })
              .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
          })
          .catch(err => res.status(400).send(err));
        })
        .catch(err => res.status(400).send(err));
      })
      .catch(err => res.status(400).send(err));
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
      let date = new Date();
      date.setHours(date.getHours() + 6);
      let isodate = date.toISOString();
      let virtualAccountNumber = ''
      return db.payment.create({
        invoiceId: "null",
        xenditId: 'null',
        status: "PENDING",
        amount: req.body.amount,
        availableBanks: "null",
      })
      .then(dataPayment => {
        let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
        return db.transaction.create({
          paymentId: dataPayment.id,
          productId: req.body.productId,
          userId: decoded.id ,
          virtualId : 0,
          pulsaId: 'null',
          number: req.body.phoneNumber,
          status: "PENDING",
          aladinPrice: req.body.amount
          })
          .then(dataTransaction => {
            return db.product.findOne({
              where:{
                id: dataTransaction.dataValues.productId
              }
            })
            .then((resultProduct) => {
              return db.product.update({
                sold: resultProduct.sold + 1
              }, {
                where: {
                  id: dataTransaction.dataValues.productId
                }
              })
              .then(productUpdate => {
                let newId = decoded.id + '-' + dataTransaction.dataValues.paymentId
                var productDescription = resultProduct.dataValues.productName
                return db.virtualAccount.findOne({
                  where: {
                    userId: decoded.id,
                    bankCode: req.body.bankCode
                  }
                })
                .then(result => {
                  if (result === null) {
                    console.log('masuk if')
                    if (req.body.bankCode === 'BRI') {
                      virtualAccountNumber = 1268000000 + decoded.id
                    } else if ( req.body.bankCode === 'MANDIRI') {
                        virtualAccountNumber = 1268000000 + decoded.id
                    } else if ( req.body.bankCode === 'BNI') {
                        virtualAccountNumber = 126800000000 + decoded.id
                    }
                    const va = virtualAccountNumber.toString()
                    console.log(va)
                    console.log(isodate)
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
                    .then(dataBalikan => {
                      console.log('data xendit', dataBalikan)
                      const data = dataBalikan.data
                      console.log(data)
                      console.log('const data', data)
                      return db.payment.update({
                        invoiceId: data.id,
                        xenditId: newId,
                        availableBanks: data.account_number
                      }, {
                        where:{
                          id: dataPayment.id
                        }
                      })
                      .then((dataAxios) => {
                        return db.virtualAccount.create({
                          userId: decoded.id,
                          bankCode: req.body.bankCode,
                          virtualAccountNumber: va
                        })
                        .then(dataVirtual => {
                          return db.transaction.update({
                            description: productDescription,
                            pulsaId: newId,
                            virtualId: dataVirtual.id
                          }, {
                            where: {
                              paymentId: dataPayment.id
                            }
                          })
                          .then( dataUpdate => {
                            return db.transaction.findOne({
                              where: {
                                paymentId: dataPayment.id
                              }
                            })
                            .then( dataFinal => {
                              res.send({
                                data,
                                dataFinal,
                                dataVirtual,
                                status: 200,
                                amount : req.body.amount,
                                message: 'new va'
                              })
                            })
                            .catch(error => res.status(400).send(error));
                          })
                          .catch(error => res.status(400).send(error));
                        })
                        .catch(error => res.status(400).send(error));
                      })
                      .catch(error => res.status(400).send(error));
                    })
                    .catch(error => {
                      if (error.response.data.error_code === 'DUPLICATE_CALLBACK_VIRTUAL_ACCOUNT_ERROR'){
                        db.payment.destroy({
                          where: {
                            id: dataPayment.id
                          }
                        })
                        .then( deletePayment => {
                          db.transaction.destroy({
                            where:{
                              id: dataTransaction.id
                            }
                          })
                          .then( deleteTransaction => {
                            res.send(error.response.data)
                          })
                        })
                      } else {
                        res.send(error.response.data)
                      }
                    });
                  } else {
                    console.log('masuk else')
                    console.log(result.virtualAccountNumber)
                    console.log(isodate)
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
                        virtual_account_number: result.virtualAccountNumber,
                        is_single_use: true,
                        expiration_date: isodate
                      },
                    })
                    .then(dataBalikan => {
                      console.log('data xendit', dataBalikan)
                      const data = dataBalikan.data
                      db.payment.update({
                        invoiceId: data.id,
                        xenditId: newId,
                        availableBanks: data.account_number
                      }, {
                        where:{
                          id: dataPayment.id
                        }
                      })
                      .then((dataAxios) => {
                        db.transaction.update({
                          description: productDescription,
                          pulsaId: newId,
                          virtualId: result.id
                        }, {
                          where: {
                            paymentId: dataPayment.id
                          }
                        })
                        .then(dataUpdate => {
                          db.transaction.findOne({
                            where:{
                              paymentId: dataPayment.id
                            }
                          })
                          .then(dataFinal => {
                            res.send({
                              data,
                              dataFinal,
                              result,
                              status: 200,
                              amount : req.body.amount,
                              message: 'va already exist'
                            })
                          })
                          .catch(error => res.status(400).send(error));
                        })
                        .catch(error => res.status(400).send(error));
                      })
                      .catch(error => res.status(400).send(error));
                    })
                    .catch(error => {
                      if (error.response.data.error_code === 'DUPLICATE_CALLBACK_VIRTUAL_ACCOUNT_ERROR'){
                        db.payment.destroy({
                          where: {
                            id: dataPayment.id
                          }
                        })
                        .then( deletePayment => {
                          db.transaction.destroy({
                            where:{
                              id: dataTransaction.id
                            }
                          })
                          .then( deleteTransaction => {
                            res.send(error.response.data)
                          })
                        })
                      } else {
                        res.send(error.response.data)
                      }
                    });
                  }
                })
                .catch(err => res.status(400).send(err));
              })
              .catch(err => res.status(400).send(err));
            })
            .catch(err => res.status(400).send(err));
          })
          .catch(err => res.status(400).send(err));
        })
        .catch(err => res.status(400).send(err));
      },
  }
