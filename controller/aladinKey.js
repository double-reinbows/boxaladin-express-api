const payment = require('../models').payment;
const transaction = require('../models').transaction;
const topup = require('../models').topup;
const axios = require ('axios')
const db = require('../models')
const jwt = require('jsonwebtoken')
let invoice = ""
let banksArr_Obj = ""
let banksStr = ""

module.exports = {
  topUpKeys(req, res) {

    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    if (decoded.emailVerified == false) {
      return res.send({ msg: 'not verified user' })
    }

    db.key.findById(req.body.keyId)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: 'Key Not Found',
        });
      }
      db.payment.create ({
        invoiceId: "null",
        xenditId: 'null',
        status: "PENDING",
        amount: data.price,
        availableBanks: "null",
      })
      .then((dataPayment) => {
        let newId = decoded.id + ('-') + dataPayment.id
        console.log('newid', newId)
        db.topup.create({
        paymentId: dataPayment.id,
        userId: decoded.id,
        keyId: req.body.keyId,
        xenditId: newId,
        status: 'PENDING'
        })
        .then((dataTopUp) => {
          axios({
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
          })
          .then(({data}) => {
            invoice = data.id,
            banksArr_Obj = data.available_banks
            banksStr = JSON.stringify(banksArr_Obj)
            db.payment.update({
              invoiceId: invoice,
              xenditId: newId,
              availableBanks: banksStr
            },{
              where:{
                id: dataPayment.id
              }
            })
            .then((data)=>{
              db.topup
              .findOne({
                where: {
                  paymentId: dataPayment.id
                }
              })
              .then(data => {
                if (!data) {
                  return res.status(404).send({
                    message: 'Data Not Found',
                  });
                }
                return res.status(200).send(data);
              })
              .catch(error => res.status(400).send(error));
            })
            .catch(err => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
  },

  all(req, res) {
    db.key.findAll()
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
        include: [
          { model: db.payment },
          { model: db.key }
        ]
      })
      .then(data => {
        // data.map(dataTopup => {
        //   dataTopup.payment.availableBanks = JSON.parse(dataTopup.payment.availableBanks)
        // })

        let dataPending = data.filter(data => data.payment.status == 'PENDING')

        res.send(dataPending)
      })

      .catch(err => res.status(400).send(err))
  },

  allByUser(req, res) {
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    return topup
      .findAll({
        where: {
          userId: decoded.id
        },
        include: [
          { model: db.payment },
          { model: db.key }

        ]
      })
      .then(data => {
        // data.map(dataTopup => {
        //   dataTopup.payment.availableBanks = JSON.parse(dataTopup.payment.availableBanks)
        // })

        res.send(data)
      })

      .catch(err => res.status(400).send(err))
  },

  byId(req, res) {
    return topup
      .findOne({
        where: {
          id: parseInt(req.params.id)
        },
        include: [
          { model: db.payment },
          { model: db.key }
        ]
      })
      .then(data => {
        // data.payment.availableBanks = JSON.parse(data.payment.availableBanks)
        res.send(data)
      })

      .catch(err => res.status(400).send(err))
  },

  createVirtualAccount(req, res) {
    let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    let date = new Date();
    date.setHours(date.getHours() + 6);
    let isodate = date.toISOString();
    if (decoded.emailVerified == false) {
      return res.send({ msg: 'not verified user' })
    }

    let virtualAccountNumber = ''
    return db.key.findById(req.body.keyId)
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
    })
    .then(dataPayment => {
      let newId = decoded.id + ('-') + dataPayment.id
      return db.topup.create({
        paymentId: dataPayment.id,
        userId: decoded.id,
        keyId: req.body.keyId,
        xenditId: newId,
        virtualId: 0,
        status: "PENDING"
        })
        .then( dataTopUp => {
          return db.virtualAccount.findOne({
            where: {
              userId: decoded.id,
              bankCode: req.body.bankCode
            }
          })
          .then(result => {
            console.log('isodate', isodate)
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
              .then(dataBalikan => {
                console.log('balikan axios', dataBalikan.data)

                const data = dataBalikan.data
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
                    virtualAccountNumber : va
                  })
                  .then(dataVirtual => {
                    return db.topup.update({
                    virtualId: dataVirtual.id
                  }, {
                    where: {
                      paymentId: dataPayment.id
                    }
                  })
                    .then( dataUpdate => {
                      return db.topup.findOne({
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
                    db.topup.destroy({
                      where:{
                        id: dataTopUp.id
                      }
                    })
                    .then( deleteTopup => {
                      res.send(error.response.data)
                    })
                  })
                } else {
                  res.send(error.response.data)
                }
              });
            } else {
              console.log('masuk else')
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
                  name: 'Pt Boxaladin AsiaPasific TopUp Aladin Key',
                  is_closed: true,
                  expected_amount: dataPayment.amount,
                  virtual_account_number: result.virtualAccountNumber,
                  is_single_use: true,
                  expiration_date: isodate
                },
              })
              .then(dataBalikan => {
                const data = dataBalikan.data
                console.log('const data', data)
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
                  db.topup.update({
                    virtualId: result.id
                  }, {
                    where: {
                      paymentId: dataPayment.id
                    }
                  })
                  .then(dataUpdate => {
                    db.topup.findOne({
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
                    db.topup.destroy({
                      where:{
                        id: dataTopUp.id
                      }
                    })
                    .then( deleteTopup => {
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
  }
};
