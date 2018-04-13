const model = require('../models')

module.exports = {

  all: (req, res) => {
    model.gamecount.findAll()
    .then(result => res.send(result))
    .catch(err => res.send(err))
  },

  // increase: (req, res) => {
  //   model.lose.findAll()
  //   .then(result => {
  //
  //     if (result.length == 0) {
  //       model.lose.create({
  //         losecount: 1
  //       })
  //       .then(createResult => res.send(createResult))
  //       .catch(err => res.send(err))
  //     } else {
  //       result[0].update({
  //         losecount: result[0].losecount + 1
  //       })
  //       .then(createResult => res.send(createResult))
  //       .catch(err => res.send(err))
  //     }
  //
  //   })
  //   .catch(err => res.send(err))
  // },

}
