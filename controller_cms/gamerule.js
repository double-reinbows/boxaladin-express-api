const model = require('../models')

module.exports = {

  all: (req, res) => {

    // function ini terima query; page, limit, orderBy, orderDirection (ASC / DESC), filterBy, filterValue,
    // startDate (2018-03-27), endDate (2018-03-28)

    // kalau tidak kirim query 'limit', default limitnya jadi 50

    // CONTOH URL DARI FRONTEND:
    // ?page=${this.state.page}&limit=${this.state.limit}&orderBy=${this.state.orederBy}&orderDirection=${this.state.orderDirection}&filterBy=${this.state.filterBy}&filterValue=${this.state.filterValue}&startDate=${this.state.startDate}&endDate=${this.state.endDate}

    console.log('--- QUERY --- :', req.query)

    let where = {}
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

    if (req.query.startDate != null && req.query.endDate != null) {
      where.createdAt = {
        $gte: new Date(req.query.startDate + '.00:00:00'),
        $lte: new Date(req.query.endDate + '.23:59:59')
      }
    }

    model.gamerule.findAll({
      where: where,
      order: order,
      limit: limit,
      offset: offset
    })
    .then(result => {
      return res.send(result)
    })
    .catch(err => {
      console.log('ERROR FIND TRANSACTION:', err)
      return res.send(err)
    })
  },

  update: (req, res) => {

    model.gamerule.findById(req.params.id)
    .then(data => {

      return data.update({
        star: req.body.star || data.star,
        pulsaAmount: req.body.pulsaAmount || data.pulsaAmount,
        description: req.body.description || data.description,
        updatedAt: new Date()
      })
      .then(updateResult => {
        console.log(updateResult.dataValues)
        return res.send({
          msg: 'update success'
        })
      })
      .catch(err => {
        console.log('ERROR UPDATE GAMERULE:', err)
        return res.send(err)
      })

    })
    .catch(err => {
      console.log('ERROR FIND GAMERULE:', err)
      return res.send(err)
    })
  },

}