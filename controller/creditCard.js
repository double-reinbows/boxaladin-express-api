const axios = require ('axios')
const db = require('../models')

module.exports = { 
  createCreditCard(req, res) {
    axios({
      method: 'POST',
      url: `https://api.xendit.co/credit_card_charges`, 
      headers: {
        authorization: "Basic eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og=="       
      },      
      data: {
        token_id: req.body.tokenId,
        external_id: req.body.externalId,
        amount: req.body.amount,
        card_cvn: req.body.cardCvn
      },
    })
    .then(({data})=>{
            console.log("sukses")
            res.status(200).send({data})
            db.payment.update({
              status: "COMPLETED",
            },{
              where:{
                id: req.body.externalId
              }
            })
            .then((data)=>{
              db.transaction.update({
                status: "COMPLETED",
              },{
                where:{
                  paymentId: req.body.externalId
                }
              }) 
            })
            .catch(err => console.log("gagal 1", err))  
          })
          .catch(err => console.log("gagal 2", err))  
        }, 
      }