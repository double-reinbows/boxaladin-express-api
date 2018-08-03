const db = require('../models')
const CircularJSON = require('circular-json')
const convert = require('xml-js')
const pulsa = require('./pulsa')
const xml = require("xml-parse");

module.exports = {
    /*
     * This is called by Xendit for Alfamart payments
     */
    createCallbackXendit(req, res) {
      if(req.headers['x-callback-token']!==undefined && req.headers['x-callback-token']===process.env.XENDIT_TOKEN)
      {
        console.log(req.body)
        const xenditExternalid = req.body.external_id;
        const splitInfo = xenditExternalid.split('-')
        //[0] = W / T / P
        //[1] = user id
        //[2] = payment id
        console.log(splitInfo)
        if (req.body.hasOwnProperty('amount')) {
          db.payment.update({
            status: "PAID"
            }, {
            where: {
              id: parseInt(splitInfo[2])
            }
          });
        } else {
          //Xendit is only sending VA status, nothing else to do
          console.log('else')
        }
        if (splitInfo[0] === 'W') {
          db.user.findOne({
              where: {
                id: parseInt(splitInfo[1])
              }
          })
          .then( dataUser => {
            db.user.update({
              wallet: dataUser.wallet + req.body.amount
            }, {
              where: {
                id: parseInt(splitInfo[1])
              }
            });
          }).catch(err => console.log(err));

          db.walletLog.update({
            status: 'PAID',
          }, {
            where: {
              paymentId: parseInt(splitInfo[2]),
            }
          });
          res.send('sukses saldo');
        } else if (splitInfo[0] === 'T') {

          db.topup.update({
            status: "PAID"
          }, {
            where: {
              paymentId: parseInt(splitInfo[2])
            }
          });

          let topupP = db.topup.findOne({
            where: {
              paymentId : parseInt(splitInfo[2])
            },
            include: [
              {
                model : db.key
              }
            ]
          });

          let userP = db.user.findOne({
            where:{
              id: splitInfo[1]
            }
          });
          Promise.all([userP, topupP]).then( values => {
            let key = parseInt(values[0].dataValues.aladinKeys) + parseInt(values[1].key.dataValues.keyAmount);
            db.user.update({
              aladinKeys: key
            },{
              where:{
                id: parseInt(splitInfo[1])
              }
            })
            res.send('top success');
          });
        } else if (splitInfo[0] === 'P') {
          console.log('buy pulsa')
          pulsa.pulsa(req,res)
        } else {
          return res.send('error transaction');
          console.log('error transaction');
        }
      } else {
            return res.status(500).send('Invalid Credentials')
        }
  },

  async createCallbackPulsa(req, res) {
    console.log('callback pulsa');
    const parsedXML = xml.parse(req.body);

    const convertJson = convert.xml2json(parsedXML[2].childNodes[0].text, { compact: true})
    const object = JSON.parse(convertJson)
    const idTransaction = object.ref_id._text
    const idTransactionSplit = object.ref_id._text.split('-')
    const response =  parsedXML[2].childNodes[15].childNodes[0].text
    console.log('response status', response);
    if(response === '00' && idTransactionSplit[0] === 'P'){
      db.transaction.update({
        status: "SUCCESS"
      },{
        where:{
          paymentId: parseInt(idTransactionSplit[2])
        }
      })
      return res.send('request callback sukses')
    } else if (response === '00' && idTransactionSplit[0] === 'W'){
      db.transaction.update({
        status: "SUCCESS"
      }, {
        where:{
          paymentId: parseInt(idTransactionSplit[3])
        }
      })
      db.payment.update({
        status: "PAID"
      }, {
        where: {
          id: parseInt(idTransactionSplit[3])
        }
      })
      const transaction = await db.transaction.findOne({
        where: {
          paymentId: parseInt(idTransactionSplit[3]) 
        }
      })
      const user = await db.user.findOne({
        where: {
          id: parseInt(idTransactionSplit[2]) 
        }
      })
      db.user.update({
        wallet: user.wallet - transaction.aladinPrice
      }, {
        where: {
          id: parseInt(idTransactionSplit[2]) 
        }
      })
      return res.send('request callback sukses')
    } else {
      db.payment.update({
        status: 'Hubungi CS Boxaladin di LINE @boxaladin'
      }, {
        where: {
          xenditId: idTransaction
        }
      })

      db.transaction.update({
        status: parsedXML[2].childNodes[9].childNodes[0].text
      },{
        where:{
          pulsaId: idTransaction
        }
      })
      return res.send('error')
    }
  },

// ********************** Contoh payload yang dikirim dari xendit: ***********************
    // {
    //   id: "579c8d61f23fa4ca35e52da4",
    //   user_id: "5781d19b2e2385880609791c",
    //   external_id: "invoice_123124123",
    //   is_high: true,
    //   status: "COMPLETED",
    //   merchant_name: "Xendit",
    //   amount: 50000,
    //   payer_email: "albert@xendit.co",
    //   description: "This is a description",
    //   fees_paid_amount: 2500,
    //   paid_amount: 50000,
    //   payment_method: "POOL",
    //   bank_code: "BCA",
    //   adjusted_received_amount: 47500,
    //   updated: "2016-10-10T08:15:03.404Z",
    //   created: "2016-10-10T08:15:03.404Z"

// ************************** payload fixed VA ***************************************
  //   {
  //     id: "58a435201b6ce2a355f46070",
  //     owner_id: "5824128aa6f9f9b648be9d76",
  //     external_id: "fixed-va-1487156410",
  //     merchant_code: "88608",
  //     account_number: "886081000123456",
  //     bank_code: "MANDIRI",
  //     name: "John Doe",
  //     is_closed: false,
  //     expiration_date: "2048-02-15T11:01:52.722Z",
  //     is_single_use: false,
  //     status: "ACTIVE",
  //     created: "2017-02-15T11:01:52.896Z",
  //     updated: "2017-02-15T11:01:52.896Z"
  // }
    /*
     * This is called by Xendit for (fixed) VA payments
     */
    callBackFixedXendit(req, res) {
      console.log('xendit req body', req.body)
      if(req.headers['x-callback-token']!==undefined && req.headers['x-callback-token']===process.env.XENDIT_TOKEN)
      {
        const xenditExternalid = req.body.external_id;
        const splitInfo = xenditExternalid.split('-')
        //[0] = W / T / P
        //[1] = user id
        //[2] = payment id

        if (req.body.hasOwnProperty('amount')) {
          db.payment.update({
            status: "PAID"
            }, {
            where: {
              id: splitInfo[2]
            }
          });
        } else {
          //Xendit is only sending VA status, nothing else to do
          return;
        }

        if (splitInfo[0] === 'W') {
          db.user.findOne({
              where: {
                id: splitInfo[1]
              }
          })
          .then( dataUser => {
            db.user.update({
              wallet: dataUser.wallet + req.body.amount
            }, {
              where: {
                id: splitInfo[1]
              }
            });
          }).catch(err => console.log(err));

          db.walletLog.update({
            status: 'PAID',
          }, {
            where: {
              paymentId: splitInfo[2],
            }
          });
          res.send('sukses saldo');
        } else if (splitInfo[0] === 'T') {

          db.topup.update({
            status: "PAID"
          }, {
            where: {
              paymentId: splitInfo[2]
            }
          });

          let topupP = db.topup.findOne({
            where: {
              paymentId : splitInfo[2]
            },
            include: [
              {
                model : db.key
              }
            ]
          });

          let userP = db.user.findOne({
            where:{
              id: splitInfo[1]
            }
          });
          Promise.all([userP, topupP]).then( values => {
            let key = parseInt(values[0].dataValues.aladinKeys) + parseInt(values[1].key.dataValues.keyAmount);
            db.user.update({
              aladinKeys: key
            },{
              where:{
                id: splitInfo[1]
              }
            })
            res.send('top success');
          });
        } else if (splitInfo[0] === 'P') {
          pulsa.pulsa(req,res)
        } else {
          return res.send('error transaction');
          console.log('error transaction');
        }
      } else {
        return res.status(500).send('Invalid Credentials')
      }
    },

    callBackPromoFixedXendit(req, res) {
      console.log('xendit req body', req.body)
      if(req.headers['x-callback-token']!==undefined && req.headers['x-callback-token']===process.env.XENDIT_TOKEN)
      {
        const xenditExternalid = req.body.external_id;
        db.payment.findOne({
          where: {
            xenditId : xenditExternalid
          }
        })
        .then(data => {
          console.log('data', data)
          if (!data) {
            return res.status(404).send({
              message: 'Id Not Found',
            });
          }else{
            if(data.status === 'PENDING'){
              console.log('update payment');
              db.payment.update({
                status: 'PAID'
              },{
                where:{
                  xenditId: xenditExternalid
                }
              })
              .then(() => {
                console.log('cari transaction sesuai xenditIdsfasfasfsafa', xenditExternalid);
                db.transaction.findOne({
                  where:{
                    pulsaId: xenditExternalid
                  }
                })
                .then((resultTransaction) => {
                  if(resultTransaction === null){
                    db.topup.findOne({
                      where: [{
                        updatedAt: {
                          $between: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()]
                        },
                      },{
                        status: "PAID"
                        }
                      ]
                    })
                    .then(findPaid => {
                      console.log('findPAIDDDDDDDDD', findPaid)
                      if (!findPaid){
                        db.topup.findOne({
                          where:{
                            xenditId: xenditExternalid
                          },
                          include:[
                            {all:true}
                          ]
                        })
                        .then( resultTopUp => {
                          console.log('update topup')
                          db.topup.update({
                            status: "PAID"
                          }, {
                            where: {
                              xenditId: xenditExternalid
                            }
                          })
                          .then(dataUpdate =>{
                            db.user.findOne({
                              where:{
                                id: resultTopUp.dataValues.userId
                              }
                            })
                            .then((resultUser) => {
                              let key = parseInt(resultUser.dataValues.aladinKeys) + parseInt(resultTopUp.key.dataValues.keyAmount)
                              db.user.update({
                                aladinKeys: key
                              },{
                                where:{
                                  id: resultUser.dataValues.id
                                }
                              })
                              .then((result) => {
                                res.send(result)
                              })
                              .catch(error =>res.status(400).send(error));
                            })
                            .catch(error => res.status(400).send(error));
                          })
                          .catch(error => res.status(400).send(error));
                        })
                        .catch(error => res.status(400).send(error));
                      } else {
                        db.topup.findOne({
                          where:{
                            xenditId: xenditExternalid
                          },
                          include:[
                            {all:true}
                          ]
                        })
                        .then( resultTopUp => {
                          console.log('update promote topup')
                          db.topup.update({
                            status: "PAID"
                          }, {
                            where: {
                              xenditId: xenditExternalid
                            }
                          })
                          .then(dataUpdate =>{
                            db.user.findOne({
                              where:{
                                id: resultTopUp.dataValues.userId
                              }
                            })
                            .then((resultUser) => {
                              let key = parseInt(resultUser.dataValues.aladinKeys) + parseInt(resultTopUp.key.dataValues.keyAmount) * 2
                              db.user.update({
                                aladinKeys: key
                              },{
                                where:{
                                  id: resultUser.dataValues.id
                                }
                              })
                              .then((result) => {
                                res.send(result)
                              })
                              .catch(error =>res.status(400).send(error));
                            })
                            .catch(error => res.status(400).send(error));
                          })
                          .catch(error => res.status(400).send(error));
                        })
                        .catch(error => res.status(400).send(error));
                      }
                    })
                  } else {
                    console.log('panggil function pulsa');
                    pulsa.pulsa(req,res)
                  }
                })
                .catch(error => res.status(400).send(error));
              })
              .catch(error => res.status(400).send(error));
            } else {
              return res.send("Callback Xendit Failed")
            }
          }})
          .catch(error => res.status(400).send(error));
        } else {
            return res.status(500).send('Invalid Credentials')
        }
    }
}
