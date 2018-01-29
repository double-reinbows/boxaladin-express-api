const payment = require('../models').payment;
const axios = require ('axios')
const db = require('../models')
var invoice = ""
var banksArr_Obj = ""
var banksStr = ""
var statusCmplt = ""

module.exports = {
  createInvoice(req, res) {
    var dataAmount = req.body.amount
    return payment
      .create({
        invoiceId: "",
        status: "PENDING",
        amount: req.body.amount,
        availableBanks: "",
      })
      .then(dataPayment => {
        db.transaction.create({
          paymentId: dataPayment.id,
          productId: dataPayment.productId,
          userId: dataPayment.userId,
          status: "PENDING"
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
              external_id: dataStrPaymentID,
              amount: dataAmount,
              payer_email: "a@gmail.com",
              description: "asd"
            },
          })
          .then(({data}) => {
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

  // updateStatus(req, res) {
  //   axios({
  //     method: 'GET',
  //     url: `https://api.xendit.co/v2/invoices/${req.params.invoice}`,
  //     headers: {
  //       authorization: "Basic eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og=="        
  //     }
  //   })
  //   .then(({data}) => {
  //     statusCmplt= data.status
  //     console.log("ini status", data.status)

  //     db.payment.update({
  //       status: data.status
  //     },{
  //       where:{
  //         id: req.params.id
  //       }
  //     })
  //     .then((data)=>{
  //       console.log("ler",statusCmplt);
  //       res.send(data)
  //     })
  //     .catch(err => console.log(err)) 
  //   })
  //   .catch(err => console.log(err)) 
  // }, 

  createCallback(req, res) {
    //TODO: CHECKING HEADER
    if(req.headers['x-callback-token']!==undefined&&req.headers['x-callback-token']==='eG5kX2RldmVsb3BtZW50X1A0cURmT3NzME9DcGw4UnRLclJPSGphUVlOQ2s5ZE41bFNmaytSMWw5V2JlK3JTaUN3WjNqdz09Og==')
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
              // getPayment.updated = req.body.updated;
              // getPayment.save();
              //TODO: POST TO API PULSA.              
              console.log("sukses")
              return res.status(200).send(data)
              }
            }
            console.log("'if' ga jalan, jdi kluar body")
            return res.send(body)
          })
          .catch(error => res.status(400).send(error)); 
    }
    return res.status(500).send('Invalid Credentials')
  }, 
};

