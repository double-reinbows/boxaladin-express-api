const model = require('../models')
const axios = require('axios')

module.exports = {
  updatePaymentExpired: (req, res) => {
    model.payment.findAll({
      where: [{
        expiredAt: null
      }]
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
          console.log('balikan xendat', data.data.expiration_date);
          model.payment.update({
            expiredAt: data.data.expiration_date
          }, {
            where : [{
                xenditId : data.data.external_id,
                status: 'PENDING',
                expiredAt: null
            }]
          })
          .then((dataUpdate) => console.log('Data update', dataUpdate))
        })
        .catch(err => {
          console.log('error xendat', result[i].invoiceId , err);
        })
      }
    })
  }
};
