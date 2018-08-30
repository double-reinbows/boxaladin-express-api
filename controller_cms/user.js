const jwt = require('jsonwebtoken')
const model = require('../models')
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const operatorsAliases = {
    $eq: op.eq,
    $or: op.or,
}
const hasher = require('../helpers/aladin_hash')
const { genRandomString } = require('../helpers/string')
const paginate = require('express-paginate');

module.exports = {

  login: (req, res) => {

    var email1 = req.body.email
    var user = email1.split('@')[0]
    var provider = email1.split('@')[1]

    if (provider == 'gmail.com') {
      let userWithoutDot = user.split('.').join('')
      var result = userWithoutDot + '@gmail.com'
      var emailFilter = result
    } else {
      var emailFilter = email1
    }

    let hashedPass = hasher(req.body.password)

    model.user.findOne({
      where: {
        $or: [{
          role: 'SUPERADMIN',
          email: emailFilter
        }, {
          role: 'ADMIN',
          email: emailFilter
        }]
      }
    })
    .then(user => {

      if (user == null) {

        return res.send({
          message: 'username or email not found'
        })

      } else if (user.password.substr(6) === hashedPass.substr(6)) {

        const token = jwt.sign({
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        }, process.env.JWT_SECRET);

        return res.send({
          message: 'login success',
          token: token,
        })

      } else if (user.password.substr(6) !== hashedPass.substr(6)) {

        return res.send({
          message: 'password incorrect'
        })

      }
    })
  },

  create: (req, res) => {

    model.user.create({
      email: req.body.email,
      emailVerified: false,
      emailToken: genRandomString(128),
      username: req.body.username,
      firstName: req.body.firstName,
      password: hasher(req.body.email),
      role: 'ADMIN',
      salt: 0,
    })
    .then(result => {
      console.log('--- CREATE USER ADMIN --- :', result)
      return res.send({
        message: 'success',
        data: result
      })
    })
    .catch(err => {
      console.log('ERROR CREATE USER ADMIN:', err)
      res.send(err)
    })
  },

  getAll(req, res){
    model.user.findAndCountAll({
      limit: req.query.limit, 
      offset: req.skip,
      order: [
        ['id', 'ASC']
      ],
      include: [
        {
          model: model.phonenumber,
          as: 'phonenumbers'
        }
      ]
      })
      .then(results => {
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);
        return res.send({
          users: results.rows,
          pageCount,
          itemCount,
          pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
        });
    }).catch(err => console.log(err))
  },

  findByEmail: (req, res) => {
    model.user.findOne({
      where:{
        $or: [{email: {$eq: req.body.email} }, { typedEmail: {$eq: req.body.email}}]
      }
    })
    .then(dataUser => {
      if (dataUser === null) {
        return res.send({message : 'email not found'})
      } else {
        model.phonenumber.findOne({
          where:[{
            userId : dataUser.id
          }]
        })
        .then(phoneUser => {
          if (phoneUser === null ){
            return res.send({
              message: 'null',
              user: dataUser
            })
          } else {
            return res.send({
              user: dataUser,
              phone: phoneUser
            })
          }
        })
      }
    })
    .catch(err => res.send(err))
  },

  findById: (req, res) => {

    const findUser = model.user.findOne({
      where: [{
        id: req.params.id
      }]
    })
    const phoneNumber = model.phonenumber.findOne({
      where: [{
        userId: req.params.id
      }]
    })

    Promise.all([findUser, phoneNumber])
      .then(data => {
        console.log(data);
        if (data[0] === null) {
          return res.send({
            message: 'email not found'
          })
        } else if (data[1] === null) {
          return res.send({
            message: 'null',
            user: data[0]
          })
        } else {
          console.log(data);
          return res.send({
            user: data[0],
            phone: data[1]
          })
        }
      })
      .catch(err => res.send(err))
    }
}
