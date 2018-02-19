const https = require ('https')
const CircularJSON = require('circular-json')
const axios = require ('axios')
var convert = require('xml-js')
const db = require('../models')
const md5 = require('md5')

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

        var sign = md5('081380572721' + '1945a66e211c9301' + dataTransaction.dataValues.id)
        console.log(sign);
        
        var pulsa = `<?xml version="1.0" ?>
                    <mp>
                      <commands>topup</commands>
                      <username>081380572721</username>
                      <ref_id>${dataTransaction.dataValues.id}</ref_id>
                      <hp>${dataTransaction.dataValues.number}</hp>
                      <pulsa_code>${dataProduct.dataValues.pulsaCode}</pulsa_code>
                      <sign>${sign}</sign>
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

          // console.log("object", object.mp.ref_id._text)
          console.log("object", object)

          db.transaction.update({
            status: object.mp.message._text,
            },{
              where:{
                id: object.mp.ref_id._text
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