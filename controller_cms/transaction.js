const model = require('../models')
const moment = require('moment')
const paginate = require('express-paginate');

module.exports = {
  allv2(req, res){
    model.transaction.findAndCountAll({
      limit: req.query.limit, 
      offset: req.skip,
      order: [
        ['id', 'DESC']
      ],
      where: {
        pulsaId: {'$ne': 'null' }
      },
      include: [
        {model: model.user},
        {model: model.payment}
      ]
      })
      .then(results => {
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);
        return res.send({
          transaction: results.rows,
          pageCount,
          itemCount,
          pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
        });
    }).catch(err => console.log(err))
  },

  allFree(req, res) {
    model.transaction.findAndCountAll({
      limit: req.query.limit, 
      offset: req.skip,
      order: [
        ['id', 'DESC']
      ],
      where: {
        $or: [{
            paymentId: {
              $eq: 0
            }
          },
          {
            description: 'FREE'
          }
        ]
      },
      include: [
        {model: model.user},
      ]
      })
      .then(results => {
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);
        return res.send({
          free: results.rows,
          pageCount,
          itemCount,
          pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
        });
    }).catch(err => console.log(err))
  },

  allTopup: (req, res) => {
    model.topup.findAndCountAll({
      limit: req.query.limit, 
      offset: req.skip,
      order: [
        ['id', 'DESC']
      ],
      where: {
        xenditId: {'$ne': 'null' }
      },
      include: [
        {model: model.user},
        {model: model.key},
        {model: model.payment}
      ]
    })
    .then(results => {
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);
      return res.send({
        topup: results.rows,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
      });
    })
    .catch(err => console.log(err))
  },

  allWalletlog: (req, res) => {
    model.walletLog.findAndCountAll({
      limit: req.query.limit, 
      offset: req.skip,
      order: [
        ['id', 'DESC']
      ],
      include: [
        {model: model.user},
        {model: model.payment}
      ]
    })
    .then(results => {
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);
      return res.send({
        wallet: results.rows,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
      });
    })
    .catch(err => console.log(err))
  },

  updateUserWallet: (req, res) => {
  model.user.findOne({
      where: {
        id: req.params.id
      },
    })
    .then(dataUser => {
      if (req.body.amount > 0) {
      return model.payment.create({
        invoiceId: dataUser.id,
        xenditId: 'ADMIN',
        status: req.body.status || 'NO STATUS',
        amount: req.body.amount,
        availableBanks: `Note : ${req.body.note ? req.body.note : 'No Note'}`,
      })
      .then(dataPayment => {
        return model.walletLog.create({
          userId: dataUser.id,
          paymentId: dataPayment.id,
          virtualId: 0,
          amount: dataPayment.amount,
          status: 'PAID'
        })
        .then(dataWalletlog => {
          model.user.update({
            wallet: parseInt(dataUser.wallet) + parseInt(dataWalletlog.amount)
          }, {
            where: {
              id: req.params.id
            }
          })
          return res.send('amount update')
        })
      })
      } else {
        return res.send('nothing updated')
      }
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
          keyId: 5,
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
            return res.send('aladin keys update')
          } else {
            return res.send('nothing update')
          }
        })
        .catch(err => {
          console.log(err);
        })
      })
    })
  }
}
