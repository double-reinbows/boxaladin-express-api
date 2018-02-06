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
    let dataAmount = req.body.amount
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
              amount: dataAmount,
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

  
    createCallback(req, res) {
      //TODO: CHECKING HEADER
      if(req.headers['x-callback-token']!==undefined&&req.headers['x-callback-token']===process.env.XENDIT_VALIDATION_TOKEN)
      {      
        //TODO: GET BODY RESPONSES
        const body = req.body;
        const paymentId = body.external_id;
        console.log("testing")
        //TODO: UPDATE ORDER IF STATUS COMPLETED
        return payment    
        .findById(paymentId)
        .then(data => {
          if (!data) {
            return res.status(404).send({
              message: 'Id Not Found',
            });
          }else{              
            if(data.status === 'PENDING'&& req.body.status === 'COMPLETED'){
              //TODO: UPDATE PAYMENT;
              //TODO: SENDING EMAIL TO USER.
              db.payment.update({
                status: req.body.status
              },{
                where:{
                  id: paymentId
                }
              })
              .then(() => {
                db.transaction.update({
                  status: req.body.status
                },{    
                  where:{    
                    paymentId: paymentId
                  }
                })
                .then((result) => {
                  // getPayment.updated = req.body.updated;
                  // getPayment.save();                  
                  //TODO: POST TO API PULSA.                               
                  console.log("sukses")                
                  // return res.status(200).send(data)                  
                  return res.status(200).send(result)                  
                })
                .catch(error => res.status(400).send(error));
                // }
              })
              .catch(error => res.status(400).send(error));
            } else {
              console.log("'if' ga jalan, jdi kluar body")
              return res.send(body)
            }
          }})
          .catch(error => res.status(400).send(error)); 
        }
        return res.status(500).send('Invalid Credentials')

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
  }, 
};

