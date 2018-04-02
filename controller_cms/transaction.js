const model = require('../models')

module.exports = {

  all: (req, res) => {

    // function ini terima query; page, limit, orderBy, orderDirection (ASC / DESC), filterBy, filterValue,
    // startDate (2018-03-27), endDate (2018-03-28)

    // kalau tidak kirim query 'limit', default limitnya jadi 50

    // CONTOH URL DARI FRONTEND:
    // ?page=${this.state.page}&limit=${this.state.limit}&orderBy=${this.state.orederBy}&orderDirection=${this.state.orderDirection}&filterBy=${this.state.filterBy}&filterValue=${this.state.filterValue}&startDate=${this.state.startDate}&endDate=${this.state.endDate}

    console.log('--- QUERY --- :', req.query)

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

    if (req.query.startDate && req.query.endDate) {
      where.createdAt = {
        $gte: new Date(req.query.startDate + '.00:00:00'),
        $lte: new Date(req.query.endDate + '.23:59:59')
      }
    }

    model.transaction.count()
    .then(countResult => {

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
        return res.send({
          data: result,
          length: countResult
        })
      })
      .catch(err => {
        console.log('ERROR FIND TRANSACTION:', err)
        return res.send(err)
      })

    })
    .catch(err => {
      console.log('ERROR COUNT TRANSACTION:', err)
      return res.send(err)
    })
  },

  allFree: (req, res) => {

    // function ini terima query; page, limit, orderBy, orderDirection (ASC / DESC), filterBy, filterValue,
    // startDate (2018-03-27), endDate (2018-03-28)

    // kalau tidak kirim query 'limit', default limitnya jadi 50

    // CONTOH URL DARI FRONTEND:
    // ?page=${this.state.page}&limit=${this.state.limit}&orderBy=${this.state.orederBy}&orderDirection=${this.state.orderDirection}&filterBy=${this.state.filterBy}&filterValue=${this.state.filterValue}&startDate=${this.state.startDate}&endDate=${this.state.endDate}

    console.log('--- QUERY --- :', req.query)

    let where = {
      $or: [
        { paymentId: { $eq: 0 } },
        { description: 'FREE' }
      ]
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

    if (req.query.startDate !== null && req.query.endDate !== null) {
      where.createdAt = {
        $gte: new Date(req.query.startDate + '.00:00:00'),
        $lte: new Date(req.query.endDate + '.23:59:59')
      }
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