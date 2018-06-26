const jwt = require('jsonwebtoken')
const https = require ('https')
const CircularJSON = require('circular-json')
const axios = require ('axios')
const convert = require('xml-js')
const db = require('../models')
const md5 = require('md5')
const Model = require('../models')
const { genRandomString } = require('../helpers/string')

function getProvider(phone) {
  phone = phone.substring(0, 4);
  if (['0817','0818','0819','0859','0877','0878'].includes(phone)) {
    return 'XL';
  } else if (['0811','0812','0813','0821','0822','0823','0852','0853','0851'].includes(phone)) {
    return 'Telkomsel';
  } else if (['0881','0882','0883','0884','0885','0886','0887','0888','0889'].includes(phone)) {
    return 'Smartfren';
  } else if (['0814','0815','0816','0855','0856','0857','0858'].includes(phone)) {
    return 'Indosat';
  } else if (['0895','0896','0897','0898','0899'].includes(phone)) {
    return 'Tri';
  } else {
    console.log('UNKOWN PROVIDER');
    return null;
  }
}
function getMobPulsaCode(provider, pulsaAmount) {
  // console.log('CUNT', typeof pulsaAmount);
  if (!provider) {
    console.log('PROVIDER NOT FOUND');
  } else if (provider === 'XL') {
    switch (pulsaAmount) {
      case 10000:
        return 'xld10000';
      case 50000:
        return 'xld50000';
      case 100000:
        return 'xld100000';
    }
  } else if (provider === 'Telkomsel') {
    switch (pulsaAmount) {
      case 10000:
        return 'htelkomsel10000';
      case 50000:
        return 'htelkomsel50000';
      case 100000:
        return 'htelkomsel100000';
    }
  } else if (provider === 'Smartfren') {
    switch (pulsaAmount) {
      case 10000:
        return 'hsmart10000';
      case 50000:
        return 'hsmart50000';
      case 100000:
        return 'hsmart100000';
    }
  } else if (provider === 'Indosat') {
    switch (pulsaAmount) {
      case 10000:
        return 'xld10000';
      case 50000:
        return 'xld50000';
      case 100000:
        return 'xld100000';
    }
  } else if (provider === 'Tri') {
    switch (pulsaAmount) {
      case 10000:
        return 'hindosat10000';
      case 50000:
        return 'hindosat50000';
      case 100000:
        return 'hindosat100000';
    }
  } else  {
    return null;
  }
}

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
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    Model.win.findOne({
      where: {
        id: req.params.id,
        userId: decoded.id
      },
      order: [['createdAt', 'DESC']]
    })
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

  checkCoinById: (req, res) => {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
    Model.user.findOne({
      where: {
        id: decoded.id
      }
    })
    .then(dataUser => {
      Model.win.count({
        where: {
          createdAt: {
            $between: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()]
          },
          userId: decoded.id
        }
      })
      .then(result => {
        if (result <= 5) {
          res.send({
            result,
            coin : dataUser.coin
          })
        } else if (result < 0) {
          res.send({
            message : 'limit habis',
            coin : dataUser.coin
          })
        } else if ( result > 5){
          res.send ({
            message : 'limit habis',
            coin : dataUser.coin
          })
        }
      })
      .catch(err => console.log('err', err))
    })
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
    // console.log(decoded);
    // if ( req.body.authentication === process.env.HASHED_PASSWORD){
      if (!req.body.winToken){
        res.send('No Token')
      }
      // else {
        console.log('sukses')
        // return;
        //TODO: maybe go back to findOne() here?
        Model.win.findAll({
          limit: 1,
          where: {
            winToken: req.body.winToken,
            userId: decoded.id
          },
          order: [ [ 'createdAt', 'DESC' ]]
        }).then(dataWin => {
          if (!dataWin){
            res.send('No Win Data');
            return;
          }
          // console.log('DICK', dataWin[0].dataValues.id);
          // return;
          // else if ( dataWin.winToken === req.body.winToken ){
          let nullWinP = db.win.update({
            winToken: null
          }, {
            where: {
              id : dataWin[0].dataValues.id
            }
          });

          Model.gamerule.findOne({
            where: {
              id: dataWin[0].dataValues.gameRuleId,
            }
          }).then(rule => {
            if (!rule) {return res.send('Invalid rule')}
            let provider = getProvider(req.body.phone);
            let pulsaCode = getMobPulsaCode(provider, rule.pulsaAmount);
            // return;
            // console.log('DICK');
            let postTransactionP = Model.transaction.create({
              paymentId: 0,
              productId: 0,
              userId: decoded.id,
              pulsaId: 'Callback from MobilePulsa not yet received',
              aladinPrice: 0,
              number: req.body.phone,
              status: 'PENDING',
              description: provider + ' ' + rule.pulsaAmount.toString(),
              // createdAt: new Date(),
              // updatedAt: new Date(),
            }).then(transactionResult => {

              // console.log('--- CREATE TRANSACTION RESULT --- :', transactionResult.dataValues)

              // Model.product.findOne({
              //   where: {
              //     id: transactionResult.dataValues.productId
              //   }
              // })
              // .then(dataProduct => {
                var newId = decoded.id + ('-free-') + transactionResult.dataValues.id
                var sign = md5('081380572721' + process.env.PULSA_KEY + newId)
                // console.log('DICK', pulsaCode);
                var pulsa =
                  `<?xml version="1.0" ?>
                      <mp>
                        <commands>topup</commands>
                        <username>081380572721</username>
                        <ref_id>${newId}</ref_id>
                        <hp>${transactionResult.dataValues.number}</hp>
                        <pulsa_code>${pulsaCode}</pulsa_code>
                        <sign>${sign}</sign>
                      </mp>`

                console.log('PULSA:', pulsa)
                console.log('SIGN:', sign)

                axios.post(process.env.MOBILE_PULSA, pulsa, {
                  headers: {
                    'Content-Type': 'text/xml',
                  },
                  httpsAgent: new https.Agent({ rejectUnauthorized: false })
                }).then((data) => {
                  let json = CircularJSON.stringify(data.data);
                  let dataJson = JSON.parse(json)
                  let convertJson = convert.xml2json(dataJson, { compact: true})
                  let object = JSON.parse(convertJson)

                  console.log('--- OBJECT RESPONSE PULSA --- :', object)

                  let updateTransactionP = db.transaction.update({
                    status: object.mp.message._text,
                    pulsaId : newId
                  }, {
                    where: {
                      id: transactionResult.dataValues.id
                    }
                  });
                  console.log('FUCK', object.mp.status._text);
                  if (object.mp.status._text === '0') {
                    return res.send('Success');
                  } else {
                    return res.send('Error');
                  }
                  updateTransactionP.then((data)=>{
                    console.log('RESULT UPDATE TRANSACTION:', data)
                    // return res.send(object.mp)
                  })
                  // .catch(err => res.send(err))

                })
                // .catch(err => res.send(err))

              // })
              // .catch(err => {
              //   console.log('ERROR FIND PRODUCT:', err)
              //   return res.send(err)
              // })

            })
            .catch(err => {
              console.log('ERROR CREATE TRANSACTION:', err)
              return res.send(err)
            })
          })

          // .then(dataWin => {


          // })
        // .catch(err => res.send(err))
          // }
        })
        // .catch(err => res.send(err))
      // }
    // } else {
    //   res.send(console.log('error wrong auth'))
    // }
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
