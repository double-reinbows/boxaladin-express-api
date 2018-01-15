const price = require('../models').price;

module.exports = {
  list(req, res) {
    return price.findAll()
      .then(data => res.status(201).send(data))
      .catch(err => res.status(400).send(err));
  },
  retrieve(req, res) {
    return price
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'Price Not Found',
          });
        }
        return res.status(200).send(data);
      })
      .catch(error => res.status(400).send(error));
  },  
  create(req, res) {
    return price
      .create({
        price: req.body.price,
      })
      .then(data => res.status(201).send(data))
      .catch(err => res.status(400).send(err));
  },
  update(req, res) {
    return price
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'Price Not Found',
          });
        }
        return data
          .update({
            price: req.body.price || data.price,
          })
          .then(() => res.status(200).send(data))  // Send back the updated data.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  destroy(req, res) {
    return price
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(400).send({
            message: 'Price Not Found',
          });
        }
        return data
        .destroy()
        .then(() => res.status(200).send({ message: 'Price deleted successfully.' }))
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};