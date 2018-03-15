const category = require('../models').category;

module.exports = {
  list(req, res) {
    return category.findAll()
      .then(data => res.status(201).send(data))
      .catch(err => res.status(400).send(err));
  },
  retrieve(req, res) {
    return category
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'category Not Found',
          });
        }
        return res.status(200).send(data);
      })
      .catch(error => res.status(400).send(error));
  },  
  create(req, res) {
    return category
      .create({
        categoryName: req.body.categoryName,
      })
      .then(data => res.status(201).send(data))
      .catch(err => res.status(400).send(err));
  },
  update(req, res) {
    return category
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(404).send({
            message: 'category Not Found',
          });
        }
        return data
          .update({
            categoryName: req.body.categoryName || data.categoryName,
          })
          .then(() => res.status(200).send(data))  // Send back the updated data.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  destroy(req, res) {
    return category
      .findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(400).send({
            message: 'category Not Found',
          });
        }
        return data
        .destroy()
        .then(() => res.status(200).send({ message: 'category deleted successfully.' }))
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};