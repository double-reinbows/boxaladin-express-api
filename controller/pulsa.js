const https = require ('https')
const CircularJSON = require('circular-json')
const axios = require ('axios')
var convert = require('xml-js')
var toJson = require('xmljson').to_json
const db = require('../models')

module.exports = {
  pulsa(req, res) {
    db.transaction.findOne({
      where: {
        paymentId: req.body.external_id
      }
    })
    .then(dataTransaction => {

      db.product.findOne({
        where: {
          id: dataTransaction.productId
        }
      })
      .then(dataProduct => {

        var pulsa = `<?xml version="1.0" ?>
                    <mp>
                      <commands>topup</commands>
                      <username>081380572721</username>
                      <ref_id>${dataTransaction.id}</ref_id>
                      <hp>${req.body.phoneNumber }</hp>
                      <pulsa_code>${dataProduct.pulsaCode}</pulsa_code>
                      <sign>b1b2cc42a395bec43ebab0f22ca80a75</sign>
                    </mp>`
        axios.post('https://testprepaid.mobilepulsa.net/v1/legacy/index', pulsa, {
            headers: {
                'Content-Type': 'text/xml',
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })
        .then((data) => {
          let json = CircularJSON.stringify(data.data);
          let dataJson = JSON.parse(json)
          let convertJson = convert.xml2json(dataJson, { compact: true})
          let object = JSON.parse(convertJson)

          console.log("object", object.mp.ref_id._text)

          db.transaction.update({
            status: object.message._text,
            },{
              where:{
                id: object.ref_id._text
              }
            })
            .then((data)=>{
              res.send(object.mp);
            })
            .catch(err => res.send(err))
        })
        .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
  }
};