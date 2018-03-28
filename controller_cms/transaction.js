const jwt = require('jsonwebtoken')
const model = require('../models')

module.exports = {

  all: (req, res) => {

    let where = {
      paymentId: {
        $ne: 0
      },
    }

    let order = []

    if (req.query.filterBy) {
      where[req.query.filterBy] = req.query.filterValue
    }

    if (req.query.orderBy) {
      order.push([ req.query.orderBy, req.query.orderDirection ])
    }

    model.transaction.findAll({
      where: where,
      order: order,
      include: [{
        all: true
      }]
    })
    .then(result => {
      return res.send(result)
    })
    .catch(err => {
      console.log('ERROR FIND TRANSACTION:', err)
      return res.send(err)
    })
  },

}