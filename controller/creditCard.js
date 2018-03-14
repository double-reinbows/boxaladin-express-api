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
          res.status(200).send({data})
        })
				.catch(err => res.send(err))

      })
      .catch(err => res.send(err))
    })
    .catch(err => res.send(err))
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
            .catch(err => res.send(err))
          })
          .catch(err => res.send(err))
        })
				.catch(err => res.send(err))
      })
      .catch(err => res.send(err))
    })
    .catch(err => res.send(err))
  },

}
