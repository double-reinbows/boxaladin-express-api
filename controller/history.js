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
        const map = dataTopUp.map(data => data.key.dataValues.keyAmount);
        for (var i = 0, sum = 0; i < map.length; sum += map[i++]);
        res.status(200).send({sum})
      }
    )
    .catch( err => console.log(err))
  }

}