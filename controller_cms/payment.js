const model = require('../models')
const axios = require('axios')

module.exports = {
  updateFixedVA: (req, res) => {
    model.payment.findAll({
      where: {
        expiredAt: null
      }
    })
    .then(result => {
      for (var i = 0; i < result.length; i++) {
        axios({
          method: 'GET',
          url: `https://api.xendit.co/callback_virtual_accounts/${result[i].invoiceId}`,
          headers: {
            authorization: process.env.XENDIT_AUTHORIZATION
          }
        })
        .then(data => {
          model.payment.update({
            expiredAt: data.data.expiration_date
          }, {
            where: [{
              invoiceId: data.data.id,
              status: 'PENDING',
              expiredAt: null
            }]
          })
          .then((dataUpdate) => console.log('Data update', dataUpdate))
          res.send('fixed VA updated')
        })
        .catch(err => {
          console.log('error xendit', result[i].invoiceId, err);
        })
      }
    })
  },

  updateNonFixedVA(req, res){
    model.payment.findAll({
      where: {
        expiredAt: null,
        invoiceId: {'$ne': 'null' }
      }
    })
    .then( async result => {
      await result.map((data, idx) => {
        axios({
          method: 'GET',
          url: `https://api.xendit.co/v2/invoices/${data.invoiceId}`,
          headers: {
            authorization: process.env.XENDIT_AUTHORIZATION
          }
        })
        .then(dataXendit => {
          console.log('data xendit', dataXendit.data)
          model.payment.update({
            expiredAt: dataXendit.data.expiry_date
          }, {
            where: {
              invoiceId: dataXendit.data.id,
              status: 'PENDING',
              expiredAt: null
            }
          })
        })
        .catch(err => console.log(err.config.data))
      })
      await model.payment.update({
        expiredAt: new Date()
      }, {
        where: {
          invoiceId: 'null',
        }
      })
      res.send('find all')
    })
  }
};
