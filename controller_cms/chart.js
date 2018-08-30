const db = require('../models')
const moment = require('moment')

module.exports = {
    // day = YYYY-MM-DD
    // month = YYYY-MM
    // year = YYYY
  chartAllTransaction: (req, res) => {
    db.sequelize.query(`select to_char(transactions."updatedAt", '${req.body.time}') "date", count(*) from transactions group by "date" order by date ASC LIMIT 500`, {
      model: db.transaction,
    })
      .then(data => {
        res.send(data)
      })
      .catch(err => res.send(err))
  },
}