const product = require('../models').product;
const firebase = require('firebase')

module.exports = {
  update: (req, res) => {
    return product
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'product Not Found',
          });
        }
        return data
          .update({
            categoryId: req.body.categoryId || data.categoryId,
            brandId: req.body.brandId || data.brandId,
            productName: req.body.productName || data.productName,
            description: req.body.description || data.description,
            stock: req.body.stock || data.stock,
            price: req.body.price || data.price,
            aladinPrice: req.body.aladinPrice || data.aladinPrice,
            pulsaCode: req.body.pulsaCode || data.pulsaCode
          })
          .then(() => { // kita ga butuh apapun dari hasil update
            product.findById(req.params.id, {
              include: [
                { all: true }
              ]
            })
            .then(result => {
              const productsRef = firebase.database().ref().child('productsdummy')
              productsRef.child(result.dataValues.id).update({
                id: result.dataValues.id,
                productName: result.dataValues.productName,
                price: result.dataValues.price,
                aladinPrice: result.dataValues.aladinPrice, //ini yang berubah pas di bidding
                brand: result.dataValues.brand.brandName,
                category: result.dataValues.category.categoryName,
                brandId: result.dataValues.brand.id,
                categoryId: result.dataValues.category.id
              })

              res.status(200).send(result)
            })
            .catch(err => {
              return res.send(err)
            })
          })
          .catch(err => {
            return res.send(err)
          })
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
      pulsaCode: req.body.pulsaCode
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
       const productsRef = firebase.database().ref().child('productsdummy')
       productsRef.child(result.id).set({
         id: result.id,
         productName: result.productName,
         price: result.price,
         aladinPrice: result.aladinPrice,
         brand: result.brand.brandName,
         category: result.category.categoryName,
         brandId: result.brand.id,
         categoryId: result.category.id,
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
          const productsRef = firebase.database().ref().child('productsdummy')
          productsRef.child(req.params.id).remove()
          res.status(200).send({ message: 'product deleted successfully.' })
        })
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },

}
