const db = require('../models');
const jwt = require('jsonwebtoken');
module.exports = {

  all: (req, res) => {
    let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
    let grPromise = db.gamerule.findAll({
      order: [['id', 'ASC']]
    });
          grPromise.then(data => {
            return res.send({
              msg: 'Verified',
              prize1: data[0].dataValues.pulsaAmount,
              prize2: data[1].dataValues.pulsaAmount,
              prize3: data[2].dataValues.pulsaAmount,
              prize4: data[3].dataValues.pulsaAmount,
              prize5: data[4].dataValues.pulsaAmount,
            });
          });
  }
}
