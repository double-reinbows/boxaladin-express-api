const jwt = require('jsonwebtoken')
const https = require ('https')
const CircularJSON = require('circular-json')
const axios = require ('axios')
const convert = require('xml-js')
const db = require('../models')
const md5 = require('md5')
const Model = require('../models')
const { genRandomString } = require('../helpers/string')

module.exports = {

  all: (req, res) => {
    Model.win.findAll({
      include: [
        { all: true }
      ]
    })
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

  byId: (req, res) => {
    Model.win.findOne({
      where: {
        id: req.params.id
      }
    }, {
      include: [
        { all: true }
      ]
    })
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

  byUser: (req, res) => {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    Model.win.findAll({
      where: {
        userId: decoded.id
      },
      include: [
        { all: true }
      ]
    })
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

  create: (req, res) => {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    // const reward = req.body.star == 5 ? 'active1' : ( req.body.star == 4 ? 'active2' : ( req.body.star == 3 ? 'active3' : ( req.body.star == 2 ? 'active4' : ( req.body.star == 1 ? 'active5' : '' ) ) ) )

    Model.gamerule.findOne({
      where: { star: parseInt(req.body.star) }
    })
    .then(gameruleResult => {

      if (gameruleResult == null) {
        return res.send({ errmsg: 'tidak ada hadiah buat jumlah star ini' })
      }

      Model.user.findOne({
        where: { id: decoded.id }
      })
      .then(userResult => {

        Model.win.create({
          userId: decoded.id,
          gameRuleId: gameruleResult.id,
          winToken: genRandomString(128)
        })
        .then(winResult => {

          Model.win.findOne({
            where: {
              id: winResult.id
            },
            include: [
              { all: true }
            ]
          })
          .then(result => {

            return res.send({
              message: 'data win created',
              data: result
            })

          })
          .catch(err => res.send(err))
        })
        .catch(err => res.send(err))
      })
      .catch(err => res.send(err))
    })
    .catch(err => res.send(err))

  },

  claimFreePulsa: (req, res) => {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    Model.transaction.create({
      paymentId: 0,
      productId: parseInt(req.body.productId),
      userId: decoded.id,
      aladinPrice: 0,
      number: req.body.phone,
      status: 'PENDING',
      description: 'FREE',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .then(transactionResult => {

      console.log('--- CREATE TRANSACTION RESULT --- :', transactionResult.dataValues)

      Model.product.findOne({
        where: {
          id: transactionResult.dataValues.productId
        }
      })
      .then(dataProduct => {

        var sign = md5(process.env.PULSA_USERNAME + process.env.PULSA_PRODCUTION_KEY + transactionResult.dataValues.id)
        var pulsa = `<?xml version="1.0" ?>
                    <mp>
                      <commands>topup</commands>
                      <username>${process.env.PULSA_USERNAME}</username>
                      <ref_id>${transactionResult.dataValues.id}</ref_id>
                      <hp>${transactionResult.dataValues.number}</hp>
                      <pulsa_code>${dataProduct.dataValues.pulsaCode}</pulsa_code>
                      <sign>${sign}</sign>
                    </mp>`

        console.log('PULSA:', pulsa)
        console.log('DATA PRODUCT:', dataProduct.dataValues)
        console.log('SIGN:', sign)

        axios.post('https://api.mobilepulsa.net/v1/legacy/index', pulsa, {
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

          console.log('--- OBJECT RESPONSE PULSA --- :', object)

          db.transaction.update({
            status: object.mp.message._text,
          }, {
            where: {
              id: object.mp.ref_id._text
            }
          })
          .then((data)=>{
            console.log('RESULT UPDATE TRANSACTION:', data)
            return res.send(object.mp)
          })
          .catch(err => res.send(err))

        })
        .catch(err => res.send(err))

      })
      .catch(err => {
        console.log('ERROR FIND PRODUCT:', err)
        return res.send(err)
      })

    })
    .catch(err => {
      console.log('ERROR CREATE TRANSACTION:', err)
      return res.send(err)
    })
  },

  resetToken: (req, res) => {
    Model.win.update({
      winToken: genRandomString(128)
    }, {
      where: {
        id: req.params.id
      }
    })
    .then(updateResult => {
      console.log('WIN TOKEN UPDATED')
      return res.send({
        msg: 'win token updated',
        data: updateResult
      })
    })
    .catch(err => {
      console.log('ERROR UPDATE WIN:', err)
      return res.send(err)
    })
  }

}
