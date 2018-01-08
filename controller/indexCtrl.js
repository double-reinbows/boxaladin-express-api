const jwt = require('jsonwebtoken')

const db = require('../models')
const hash = require('../helpers/aladin_hash')

const SECRET = 'aradin'

exports.getAll = (req, res) => {
  db.user.findAll({
    order: [['username', 'ASC']]
  })
  .then(data => {
    res.send(data)
  })
}

exports.signin = (req, res) => {
  let hashedPass = hash(req.body.password)
  db.user.findOne({ where: { username: req.body.username }})
  .then(user => {
    if (user.password.substr(6) === hashedPass.substr(6)) {
      console.log('signed in')
      let token = jwt.sign({username: user.username, email: user.email}, SECRET)
      res.send(token)
    } else {
      console.log('wrong pass')
      res.send('wrong password')
    }
  })
}

exports.signup = (req, res) => {
  req.body.password = hash(req.body.password)
  db.user.create(req.body)
  .then(data => {
    let token = jwt.sign({username: data.username, email: data.email}, SECRET)
    res.send(token)
  })
}
