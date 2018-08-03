const product = require('../models').product;
const db = require('../models')
const firebase = require('firebase')

module.exports = {
  update: (req, res) => {
    return product
      .findById(req.params.id)
      .then(async data => {
        if (!data) {
          return res.status(404).send({
            message: 'product Not Found',
          });
        }
        await data
          .update({
            categoryId: req.body.categoryId || data.categoryId,
            brandId: req.body.brandId || data.brandId,
            productName: req.body.productName || data.productName,
            description: req.body.description || data.description,
            stock: req.body.stock || data.stock,
            price: req.body.price || data.price,
            aladinPrice: req.body.aladinPrice || data.aladinPrice,
            pulsaCode: req.body.pulsaCode || data.pulsaCode,
            displayPrice: req.body.displayPrice || data.displayPrice,
            decreasePrice: req.body.decreasePrice || data.decreasePrice
          })
          const productsRef = firebase.database().ref().child(process.env.FIREBASE_DB)
          productsRef.child(req.params.id).update({
            productName: req.body.productName || data.productName,
            price: req.body.price || data.price,
            aladinPrice: req.body.aladinPrice || data.aladinPrice, //ini yang berubah pas di bidding
            displayPrice: req.body.displayPrice || data.displayPrice,
            decreasePrice: req.body.decreasePrice || data.decreasePrice
          })
          return res.status(200).send('result')
        })
        .catch(err => {
          return res.send(err)
        })

  },

  create: (req, res) => {
    product.create({
      categoryId: req.body.categoryId,
      brandId: req.body.brandId,
      productName: req.body.productName,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price,
      aladinPrice: req.body.price,
      pulsaCode: req.body.pulsaCode,
      displayPrice: req.body.displayPrice,
      decreasePrice: req.body.decreasePrice,
      opened: 0,
      sold: 0
    })
    .then(data => {
      product.findOne({
        where: {
          id: data.id
        },
        include: [
          { all: true }
        ]
      })
      .then(result => {
        const productsRef = firebase.database().ref().child(process.env.FIREBASE_DB)
        productsRef.child(result.id).set({
          id: result.id,
          productName: result.productName,
          price: result.price,
          aladinPrice: result.aladinPrice,
          decreasePrice: result.decreasePrice,
          displayPrice: result.displayPrice,
          brand: result.brand.brandName,
          watching: 0,
          brandLogo: result.brand.brandLogo
        })
      res.status(201).send(data)
    })
    .catch(err => {
      res.send(err)
    })
    })
    .catch(err => {
      res.send(err)
    })
  },

  destroy: (req, res) => {
    return product
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(400).send({
            message: 'product Not Found',
          });
        }
        return data
        .destroy()
        .then(result => {
          // hapus data di firebase sesuai id dari result
          const productsRef = firebase.database().ref().child(process.env.FIREBASE_DB)
          productsRef.child(req.params.id).remove()
          res.status(200).send({ message: 'product deleted successfully.' })
        })
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },

  setActiveProduct: (req, res) => {
    return product
      .findById(req.params.id)
      .then(async data => {
        if (!data) {
          return res.status(404).send({
            message: 'product Not Found',
          });
        }
        await data.update({
            active: req.body.status
          })
            res.send(data)
        })
        .catch(err => {
          return res.send(err)
        })
  },
}
