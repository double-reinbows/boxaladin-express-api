const db = require('../models')
const jwt = require('jsonwebtoken')

module.exports = {
  increaseOpen (req, res) {
    db.product.findOne({
      where:{
        id: req.body.productId
      }
    })
    .then(product =>{
      db.product.update({
        opened: product.opened + 1
      },  {
        where:{
          id: req.body.productId
        }
      })
      .then(result => {
        console.log('sukses')
      })
    })
    .catch(err => res.send(err))
  },

  increaseSold (req, res) {
    db.product.findOne({
      where:{
        id: req.body.productId
      }
    })
    .then(product =>{
      db.product.update({
        sold: product.sold + 1
      },  {
        where:{
          id: req.body.productId
        }
      })
      .then(result => {
        console.log('sukses')
      })
    })
    .catch(err => res.send(err))
  }
}

// buat update payment opened dan sold karena ganti flow