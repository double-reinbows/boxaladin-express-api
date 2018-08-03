const model = require('../models')
const moment = require('moment')

module.exports = {

  /* function ini terima query; page, limit, orderBy, orderDirection (ASC / DESC), filterBy, filterValue,
   * startDate (2018-03-27), endDate (2018-03-28)
   * kalau tidak kirim query 'limit', default limitnya jadi 50
   * CONTOH URL DARI FRONTEND:
   * ?page=${this.state.page}&limit=${this.state.limit}&orderBy=${this.state.orederBy}&orderDirection=${this.state.orderDirection}&filterBy=${this.state.filterBy}&filterValue=${this.state.filterValue}&startDate=${this.state.startDate}&endDate=${this.state.endDate}
   */
  all: (req, res) => {
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
      order.push([req.query.orderBy, req.query.orderDirection])
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

        model.transaction.findAll({
             where,
             order,
             limit,
             offset,
            include: [{
              all: true
            }]
          })
          .then(result => {
            return res.send({
              data: result,
              // length: result.length()
            })
          })
          .catch(err => {
            console.log('ERROR FIND TRANSACTION:', err)
            return res.send(err)
          })
      .catch(err => {
        console.log('ERROR COUNT TRANSACTION:', err)
        return res.send(err)
      })
  },

  // function ini terima query; page, limit, orderBy, orderDirection (ASC / DESC), filterBy, filterValue,
  // startDate (2018-03-27), endDate (2018-03-28)

  // kalau tidak kirim query 'limit', default limitnya jadi 50

  // CONTOH URL DARI FRONTEND:
  // ?page=${this.state.page}&limit=${this.state.limit}&orderBy=${this.state.orederBy}&orderDirection=${this.state.orderDirection}&filterBy=${this.state.filterBy}&filterValue=${this.state.filterValue}&startDate=${this.state.startDate}&endDate=${this.state.endDate}
  allFree: (req, res) => {
    console.log('--- QUERY --- FREE:', req.query)

    let where = {
      $or: [{
          paymentId: {
            $eq: 0
          }
        },
        {
          description: 'FREE'
        }
      ]
    }

    let order = []
    let limit = req.query.limit || 50
    let offset = 0

    if (req.query.filterBy) {
      where[req.query.filterBy] = req.query.filterValue
    }

    if (req.query.orderBy) {
      order.push([req.query.orderBy, req.query.orderDirection])
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

    model.transaction.findAll({
        where,
        order,
        limit,
        offset,
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

  allTopup: (req, res) => {
    model.topup.findAll({
        include: {
          all: true
        }
      })
      .then(result => {
        return res.send(result)
      })
      .catch(err => {
        console.log('ERROR FIND TOPUPS:', err)
        return res.send(err)
      })
  },

  updateUserWallet: (req, res) => {
      model.user.findOne({
          where: {
            id: req.params.id
          },
        })
        .then(dataUser => {
          model.payment.create({
              invoiceId: dataUser.id,
              xenditId: 'ADMIN',
              status: req.body.status || 'NO STATUS',
              amount: req.body.amount,
              availableBanks: `Note : ${req.body.note ? req.body.note : 'No Note'}`,
              expiredAt: new Date(),
              createdAt: new Date(req.body.year, req.body.month - 1, req.body.day , req.body.hours || 7 - 7, req.body.minutes || 0, req.body.seconds || 0, 0) || new Date()
            })
            .then(dataPayment => {
             if (req.body.amount > 0) {
                model.walletLog.create({
                    userId: dataUser.id,
                    paymentId: dataPayment.id,
                    virtualId: 0,
                    amount: dataPayment.amount,
                    status: 'PAID'
                  })
                  .then(dataWalletlog => {
                    model.user.update({
                      wallet: parseInt(dataUser.wallet) + parseInt(dataWalletlog.amount) || dataUser.wallet
                    }, {
                      where: {
                        id: req.params.id
                      }
                    })
                    res.send('amount update')
                  })
              } else {
                res.send('nothing updated')
              }
            })
        })
        .catch(err => {
          console.log(err);
        })
  },

  updateAladinKeys: (req, res) => {
    model.user.findOne({
        where: {
          id: req.params.id
        },
      })
      .then(dataUser => {
        model.payment.create({
            invoiceId: dataUser.id,
            xenditId: 'ADMIN',
            status: 'UPDATE Aladin Keys',
            amount: 0,
            availableBanks: `Note : ${req.body.note ? req.body.note : 'No Note'}`,
            expiredAt: new Date()
          })
          .then(dataPayment => {
            model.topup.create({
                userId: dataUser.id,
                keyId: 0,
                paymentId: dataPayment.id,
                xenditId: `ADMIN ${req.body.aladinkeys}`,
                status: `ADMIN`,
                virtualId: 0
              })
              .then(data => {
                model.user.update({
                  aladinKeys: parseInt(dataUser.aladinKeys) + parseInt(req.body.aladinkeys) || dataUser.aladinKeys,
                }, {
                  where: {
                    id: req.params.id
                  }
                })
                if (req.body.aladinkeys > 0 ) {
                  res.send('aladin keys update')
                } else {
                  res.send('nothing update')
                }
              })
              .catch(err => {
                console.log(err);
              })
          })
      })
  }
}
