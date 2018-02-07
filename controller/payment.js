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
        status: "PENDING",
        aladinPrice: req.body.amount
        })
        .then(dataTransaction => {
          let dataStrPaymentID = dataTransaction.dataValues.paymentId.toString()
          axios({
            method: 'POST',
            url: `https://api.xendit.co/v2/invoices`, 
            headers: {
              authorization: "Basic eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og=="       
            },      
            data: {
              // external_id: "paymentId no" +""+ dataStrPaymentID,
              external_id: dataStrPaymentID,
              amount: req.body.amount,
              payer_email: decoded.email,
              // --------description = description dari product-------------
              description: "asd"
            },
          })
          .then(({data}) => {
            console.log('user', decoded.email)
            console.log('status', data.status)
            invoice = data.id,
            banksArr_Obj = data.available_banks
            banksStr = JSON.stringify(banksArr_Obj)
            db.payment.update({
              invoiceId: invoice,
              availableBanks: banksStr
            },{
              where:{
                id: dataPayment.id
              }
            })
            .then((data)=>{
              db.payment
              .findById(dataPayment.id)
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
            .catch(err => console.log(err)) 
          })
          .catch(err => console.log(err))
        })
        .catch(err => res.status(400).send(err));
      })
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

  
    updateStatus(req, res) {
      axios({
        method: 'GET',
        url: `https://api.xendit.co/v2/invoices/${req.params.invoice}`,
        headers: {
          authorization: "Basic eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og=="        
        }
      })
      .then(({data}) => {
        db.payment.update({
          status: data.status
        },{
          where:{
            id: req.params.id
          }
        })
        .then((data)=>{
          console.log(data)
          res.send(data)
        })
        .catch(err => console.log(err)) 
      })
      .catch(err => console.log(err)) 
    }, 
};

