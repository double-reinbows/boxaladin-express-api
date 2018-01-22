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
        console.log("balikan db lokal", data.dataValues.amount)
        db.transaction.create({
          paymentId: data.id,
          productId: data.productId,
          userId: data.userId,
          status: "PENDING"
        })
        .then(data => {
          console.log("TESTIG AMOUNT ->>", dataAmount)
          const encode_token = new Buffer("eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og==:").toString('base64')
          console.log("HASIL ENCODE ", encode_token)
          axios({
            method: 'POST',
            url: 'https://api.xendit.co//v2/invoices', 
            headers: {
              authorization: "Basic " + encode_token    
            },      
            data: {
              external_id: data.paymentId,
              amount: 40000,
              payer_email: "a@gmail.com",
              description: "asd"
            },
          })
          .then((data) => {
            console.log("BAlikan API XENDIT ", data)
            // res.send(data)
          })
          .catch(err => console.log("ERR APAA ??", err))
        })
        .catch(err => res.status(400).send(err));
        
      })
  }, 
};
