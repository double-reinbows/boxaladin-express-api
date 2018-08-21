const db = require('../models')
const jwt = require('jsonwebtoken')

module.exports = {
  increaseOpen (req, res) {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
    //add 1 coin to user for using a key
    db.user.findOne({
      where: {
        id: decoded.id,
      }
    })
    .then((userRow) => {
      //increase coins and reduce keys
      db.user.update({
        coin: userRow.dataValues.coin + 1,
        aladinKeys: userRow.dataValues.aladinKeys - 1,
      }, {
        where: {
          id: decoded.id,
        }
      });
    });
    //update opened column in product
    if (req.body.type === 'product'){
      console.log('find product')
      return db.product.findOne({
        where: {
          id: req.body.priceId
        }
      })
      .then(product => {
        db.product.update({
          opened: product.opened + 1
        },  {
          where:{
            id: req.body.priceId
          }
        })
        return res.send('open 1')
      })
      .catch(err => res.send(err))
    } else if (req.body.type === 'price'){
      console.log('find price')
      db.pulsaPrice.findOne({
        where:{
          id: req.body.priceId
        }
      })
      .then(price =>{
        db.pulsaPrice.update({
          opened: price.opened + 1
        },  {
          where:{
            id: req.body.priceId
          }
        })
        return res.send('open 1')
      })
      .catch(err => res.send(err))
    }
  },

  async increaseNoInvoice (req, res) {
    try {
      if (req.body.type === 'product'){
        console.log('product')
        const product = await db.product.findOne({where: {id: req.body.id}})
        db.product.update(
          {noInvoice: product.noInvoice + 1},
          {where: {id: req.body.id}}
        )
        return res.send('product update')
      } else if (req.body.type === 'price'){
        console.log('price')
        const price = await db.pulsaPrice.findOne({where: {id: req.body.id}})
        db.pulsaPrice.update(
          {noInvoice: price.noInvoice + 1},
          {where: {id: req.body.id}}
        )
        return res.send('update')
      }
    } catch(err){console.log(err)
    }
  },

  logBid(req, res) {
    let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
    db.aladinkeyLog.create({
      userId: decoded.id,
      pulsaPriceId: req.body.priceId,
      productId: 0,
      priceAfter: req.body.priceAfter,
      priceBefore: req.body.priceBefore
    })
    //sending null so frontend isn't stuck waiting
    res.send('log')
  }
}
