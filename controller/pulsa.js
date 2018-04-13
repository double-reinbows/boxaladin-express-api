const https = require ('https')
const CircularJSON = require('circular-json')
const axios = require ('axios')
var convert = require('xml-js')
const db = require('../models')
const md5 = require('md5')
const jwt = require ('jsonwebtoken')
module.exports = {
  pulsa(req, res) {
    db.transaction.findOne({
      where: {
        pulsaId: req.body.external_id
      }
    })
    .then(dataTransaction => {
      console.log('daat transaksi', dataTransaction)
      var refId = req.body.external_id
      db.product.findOne({
        where: {
          id: dataTransaction.productId
        }
      })
      .then(dataProduct => {
        var sign = md5('081380572721' + process.env.PULSA_KEY + refId)        
        var pulsa = `<?xml version="1.0" ?>
                    <mp>
                      <commands>topup</commands>
                      <username>081380572721</username>
                      <ref_id>${refId}</ref_id>
                      <hp>${dataTransaction.dataValues.number}</hp>
                      <pulsa_code>${dataProduct.dataValues.pulsaCode}</pulsa_code>
                      <sign>${sign}</sign>
                    </mp>`
        axios.post(process.env.MOBILE_PULSA, pulsa, {
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
          console.log(object)
          db.transaction.update({
            status: object.mp.message._text,
            },{
              where:{
                id: dataTransaction.dataValues.id
              }
            })
            .then((data)=>{
              console.log('sukses')
              console.log(object.mp)
              res.send(object.mp);
            })
            .catch(err => res.send(err))
        })
				.catch(err => res.send(err))
      })
      .catch(err => res.send(err))
    })
    .catch(err => res.send(err))
  }
};
