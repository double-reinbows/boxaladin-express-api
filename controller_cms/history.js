const db = require('../models')

module.exports = {

  keyHistory(req, res) {
    db.topup.findAll({
      include: [
      {
        model: db.key
      },
      {
        model: db.payment
      },
    ],
      where: [{
        createdAt: {
          $between: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()]
        },
      },{
        status: "PAID"
      }
    ]
    })
    .then(dataTopUp => {
        const map = dataTopUp.map(data => data.key.keyAmount);
        for (var i = 0, sum = 0; i < map.length; sum += map[i++]);
        res.status(200).send({sum})
      }
    )
    .catch( err => console.log(err))
  },

  pulsaHistory(req, res) {
    db.transaction.findAll({
      include: [
      {
        model: db.payment
      },
      {
        model: db.product
      },
    ],
      where: [{
        createdAt: {
          $between: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()]
        },
      },{
        status: "PAID"
      }
    ]
    })
    .then(dataPulsa => {
      // res.send(dataPulsa)
        const map = dataPulsa.map(data => data.product.displayPrice);
        for (var i = 0, pulsaSold = 0; i < map.length; pulsaSold += map[i++]);
        res.status(200).send({pulsaSold})
      }
    )
    .catch( err => console.log(err))
  }

}