const db = require('../models')
const CircularJSON = require('circular-json')
const convert = require('xml-js')
const pulsa = require('./pulsa')
const xml = require("xml-parse");

module.exports = {
    createCallbackXendit(req, res) {
      if(req.headers['x-callback-token']!==undefined && req.headers['x-callback-token']===process.env.XENDIT_TOKEN)
      {      
        const xenditExternalid = req.body.external_id;
        db.payment.findOne({
          where: {
            xenditId : xenditExternalid
          }
        })
        .then(data => {
          if (!data) {
            return res.status(404).send({
              message: 'Id Not Found',
            });
          }else{
            if(data.status === 'PENDING'&& req.body.status === 'PAID'){
              console.log('update payment');
              db.payment.update({
                status: req.body.status
              },{
                where:{
                  xenditId: xenditExternalid
                }
              })
              .then(() => {
                console.log('cari transaction sesuai xenditId', xenditExternalid);
                db.transaction.findOne({
                  where:{
                    pulsaId: xenditExternalid
                  }
                })
                .then((resultTransaction) => {
                  if(resultTransaction === null){
                    db.topup.findOne({
                      where:{
                        xenditId: xenditExternalid
                      },
                      include:[
                        {all:true}
                      ]
                    })
                    .then((resultTopUp)=>{
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
                          var key = parseInt(resultUser.dataValues.aladinKeys) + parseInt(resultTopUp.key.dataValues.keyAmount)
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
  },

  createCallbackPulsa(req, res) {
    console.log('callback pulsa');
    let parsedXML = xml.parse(req.body);

    let convertJson = convert.xml2json(parsedXML[2].childNodes[0].text, { compact: true})
    let object = JSON.parse(convertJson)
    let idTransaction = object.ref_id._text
    let response =  parsedXML[2].childNodes[9].childNodes[0].text
    console.log('data', response);
    if(response === '00'){
      db.transaction.update({
        status: "SUCCESS"
      },{
        where:{
          pulsaId: idTransaction
        }
      })
      .then((data) => {
        console.log('request callback sukses')
      })
      .catch(err => res.send(err))
    } else {
      db.transaction.update({
        status: response
      },{
        where:{
          pulsaId: idTransaction
        }
      })
      .then((data) => {
        console.log("error / failed", response)
      })
      .catch(err => res.send(err))
    }
  },

    // Contoh payload yang dikirim dari xendit:
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

    //payload fixed VA
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

    callBackFixedXendit(req, res) {
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
                console.log('cari transaction sesuai xenditId', xenditExternalid);
                db.transaction.findOne({
                  where:{
                    pulsaId: xenditExternalid
                  }
                })
                .then((resultTransaction) => {
                  if(resultTransaction === null){
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
                          var key = parseInt(resultUser.dataValues.aladinKeys) + parseInt(resultTopUp.key.dataValues.keyAmount)
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