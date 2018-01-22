const payment = require('../models').payment;
const axios = require ('axios')
const db = require('../models')

module.exports = {
  create(req, res) {
    var dataAmount = req.body.amount
    return payment
      .create({
        status: "PENDING",
        amount: req.body.amount,
        availableBanks: "",
      })
      .then(data => {res.send(data)
        console.log("balikan db lokal 1", data.dataValues.amount)
        db.transaction.create({
          paymentId: data.id,
          productId: data.productId,
          userId: data.userId,
          status: "PENDING"
        })
        .then(data => {
          console.log("balikan db lokal 2", dataAmount)
          console.log(data)
          let dataStrPaymentID = data.dataValues.paymentId.toString()
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
          .then(({data}) => {console.log(data)})
          .catch(err => console.log(err))
        })
        .catch(err => res.status(400).send(err));
        
      })
  }, 
};
