const jwt = require('jsonwebtoken')
const model = require('../models')

module.exports = {

  all: (req, res) => {

    // function ini terima query; page, limit, orderBy, orderDirection (ASC/DESC), filterBy, filterValue

    let where = {
      paymentId: {
        $ne: 0
      },
    }

    let order = []
    let limit = req.query.limit || 50
    let offset = 0

    if (req.query.filterBy) {
      where[req.query.filterBy] = req.query.filterValue
    }

    if (req.query.orderBy) {
      order.push([ req.query.orderBy, req.query.orderDirection ])
    }

    if (req.query.page === null) {
      req.query.page = 1
    }

    if (req.query.page > 1) {
      offset = (req.query.page - 1) * limit
    }

    model.transaction.findAll({
      where: where,
      order: order,
      limit: limit,
      offset: offset,
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