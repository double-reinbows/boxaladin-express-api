const pulsaPrice = require('../models').pulsaPrice;

module.exports = {
  list(req, res) {
    return pulsaPrice.findAll({
      order: [['id', 'ASC']],
    })
      .then(data => res.status(201).send(data))
      .catch(err => res.status(400).send(err));
  },
  retrieve(req, res) {
    return pulsaPrice
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'pulsaPrice Not Found',
          });
        }
        return res.status(200).send(data);
      })
      .catch(error => res.status(400).send(error));
  },  
  create(req, res) {
    return pulsaPrice
      .create({
        pulsaPriceName: req.body.pulsaPriceName,
      })
      .then(data => res.status(201).send(data))
      .catch(err => res.status(400).send(err));
  },
  update(req, res) {
    return pulsaPrice
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'pulsaPrice Not Found',
          });
        }
        return data
          .update({
            pulsaPriceName: req.body.pulsaPriceName || data.pulsaPriceName,
          })
          .then(() => res.status(200).send(data))  // Send back the updated data.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  destroy(req, res) {
    return pulsaPrice
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(400).send({
            message: 'pulsaPrice Not Found',
          });
        }
        return data
        .destroy()
        .then(() => res.status(200).send({ message: 'pulsaPrice deleted successfully.' }))
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};
