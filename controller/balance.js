const axios = require ('axios')
const db = require('../models')

const balance = require('../models').brand;

module.exports = {
  balance(req, res) {
      axios({
        method: 'GET',
        url: `https://api.xendit.co/balance`,
        headers: {
          authorization: "Basic eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og=="        
        }
      })
      .then(({data}) => {
        res.send(data)
      })
      .catch(err => console.log(err))
  },

  invoice(req, res) {
		axios({
			method: 'POST',
      url: `https://api.xendit.co/v2/invoices`, 
      headers: {
        authorization: "Basic eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og=="       
      },      
      data: {
        external_id: external,
        amount: req.body.amount,
        payer_email: req.body.payer_email,
        description: req.body.description
      },
		})
    .then(({data}) => {
      res.send(data)
      db.transaction.create({
        amount: data.amount,
        status: data.status
      })
    })
		.catch(err => console.log(err))
    },
  
}
