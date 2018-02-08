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
      db.payment.update({
        status: "COMPLETED",
      },{
        where:{
          id: req.body.externalId
        }
      })
      .then((data)=>{
        // res.status(200).send({data})
        db.transaction.update({
          status: "COMPLETED",
        },{
          where:{
            paymentId: req.body.externalId
          }
        })
        .then(data => {
          console.log('Payment & Transaction updated!');
          res.status(200).send({data})
        })
        .catch(err => console.log("Error update transaction:", err))

      })
      .catch(err => console.log("Error update payment:", err))
    })
    .catch(err => console.log("Error Xendit CC charges:", err))
  },

  createCreditCardTopup(req, res) {
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
      db.payment.update({
        status: "COMPLETED",
      },{
        where:{
          id: req.body.externalId
        }
      })
      .then((data)=>{




        db.topup.findOne({
          where:{
            paymentId: req.body.externalId
          },
          include:[
            {all:true}
          ]
        })
        .then((resultTopUp)=>{
          console.log("resulttopup", resultTopUp.dataValues.userId)
          db.user.findOne({
            where:{
              id: resultTopUp.dataValues.userId
            }
          })
          .then((resultUser) => {
            console.log('aaaa', resultUser.dataValues.aladinKeys)
            console.log('bbb', resultTopUp.key.dataValues.keyAmount)
            var key = parseInt(resultUser.dataValues.aladinKeys) + parseInt(resultTopUp.key.dataValues.keyAmount)
            db.user.update({
              aladinKeys: key
            },{
              where:{
                id: resultUser.dataValues.id
              }
            })
            .then((result) => {
              console.log ('top up aladin keys berhasil')
              res.send(result)
            })
            .catch(error => console.log('error', error));
          })
          .catch(error => console.log('error', error));
        })
        .catch(error => res.status(400).send(error));




      })
      .catch(err => console.log("Error update payment:", err))
    })
    .catch(err => console.log("Error Xendit CC charges:", err))
  },

}
