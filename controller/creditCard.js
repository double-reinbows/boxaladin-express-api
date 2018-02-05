const payment = require('../models').payment;
const transaction = require('../models').transaction;
const jwt = require('jsonwebtoken')
const axios = require ('axios')
const db = require('../models')
let invoice = ""
let banksArr_Obj = ""
let banksStr = ""
let tokenId ="5a77fac142aff8311d581bd5"

module.exports = { 
  createCreditCard(req, res) {
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
            console.log("ini data 1", data)

            db.payment.update({
              invoiceId: invoice,
              availableBanks: banksStr
            },{
              where:{
                id: dataPayment.id
              }
            })
            .then((data)=>{
              console.log("ini data 3", dataPayment)
              console.log('ini data invoice', invoice)
              console.log('data paymentid', dataStrPaymentID)
              console.log('data amount', dataAmount)
              console.log('data token', tokenId)

              Xendit.card.createToken(tokenData, function (err, data) {
                if (err) {
                    //Define error handling
                }
                if (data.status === 'VERIFIED') {
                axios({
                method: 'POST',
                url: `https://api.xendit.co/credit_card_charges`, 
                headers: {
                  authorization: "Basic eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og=="       
                },      
                data: {
                  token_id: tokenId,
                  external_id: dataStrPaymentID,
                  amount: dataAmount,
                  card_cvn: "123"
                },
              })
              .then((data)=>{
                console.log("sukses")
              })
              .catch(err => console.log("gagal", err)) 
                } else if (data.status === 'IN_REVIEW') {
                    // Handle authentication (3DS)
                } else if (data.status === 'FAILED') {
                    // Handle failure
                }
            });

   

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
            // .then((dataPayment)=>{
            //   console.log("ini data 3", dataPayment)
            //   axios({
            //     method: 'POST',
            //     url: `https://api.xendit.co/credit_card_charges`, 
            //     headers: {
            //       authorization: "Basic eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og=="       
            //     },      
            //     data: {
            //       token_id: "5a77dceb42aff8311d581b41",
            //       external_id: dataStrPaymentID,
            //       amount: dataAmount,
            //       card_cvn: "123"
            //     },
            //   })
            //   .then((data)=>{
            //     console.log("sukses")
            //   })
            //   .catch(err => console.log("gagal", err)) 
            // })
            .catch(err => console.log(err)) 
          })
          .catch(err => console.log(err))
        })
        .catch(err => res.status(400).send(err));
      })
  }, 
}