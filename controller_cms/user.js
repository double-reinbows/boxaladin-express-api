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

        res.send({
          message: 'username or email not found'
        })

      } else if (user.password.substr(6) === hashedPass.substr(6)) {

        const token = jwt.sign({
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        }, process.env.JWT_SECRET);

        res.send({
          message: 'login success',
          token: token,
        })

      } else if (user.password.substr(6) !== hashedPass.substr(6)) {

        res.send({
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
      return res.send(err)
    })
  },

  getUserWithPhone: (req, res) => {
    model.user.findAll({
      include: [{
        all: true
      }]
    }).then(dataUser => {
      res.send(dataUser)
    })
    .catch(err => res.send(err))
  },

  //   getAll: (req, res) => {
  //     let where = {
  //       id: {
  //         $ne: 0
  //       },
  //     }

  //     let order = []
  //     let limit = req.query.limit || 50
  //     let offset = 0

  //     if (req.query.filterBy) {
  //       where[req.query.filterBy] = req.query.filterValue
  //     }

  //     if (req.query.orderBy) {
  //       order.push([ req.query.orderBy, req.query.orderDirection ])
  //     }

  //     if (req.query.page === null) {
  //       req.query.page = 1
  //     }

  //     if (req.query.page > 1) {
  //       offset = (req.query.page - 1) * limit
  //     }

  //     if (req.query.startDate && req.query.endDate) {
  //       where.createdAt = {
  //         $gte: new Date(req.query.startDate + '.00:00:00'),
  //         $lte: new Date(req.query.endDate + '.23:59:59')
  //       }
  //     }

  //     model.user.count()
  //     .then(countResult => {

  //       model.user.findAll({
  //         where: where,
  //         order: order,
  //         limit: limit,
  //         offset: offset,
  //         include: [{
  //           all: true
  //         }],
  //         // where: [{
  //         //   primary: true
  //         // }]
  //       })
  //       .then(result => {
  //         return res.send({
  //           data: result,
  //           length: countResult
  //         })
  //       })
  //       .catch(err => {
  //         console.log('ERROR FIND USER:', err)
  //         return res.send(err)
  //       })

  //     })
  //     .catch(err => {
  //       console.log('ERROR COUNT USER:', err)
  //       return res.send(err)
  //     })
  // },

  getAll: (req, res) => {
    model.user.findAll({
      order: [['id', 'ASC']],
      include: [
        { all: true },
      ]
    })
    .then(dataUser => {
      res.send(dataUser)
    })
    .catch(err => console.log(err))
  },

  findByEmail: (req, res) => {
    model.user.findOne({
      where:{
        $or: [{email: {$eq: req.body.email} }, { typedEmail: {$eq: req.body.email}}]
      }
    })
    .then(dataUser => {
      if (dataUser === null) {
        res.send({message : 'email not found'})
      } else {
        model.phonenumber.findOne({
          where:[{
            userId : dataUser.id
          }]
        })
        .then(phoneUser => {
          if (phoneUser === null ){
            res.send({
              message: 'null',
              user: dataUser
            })
          } else {
            res.send({
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
          res.send({
            message: 'email not found'
          })
        } else if (data[1] === null) {
          res.send({
            message: 'null',
            user: data[0]
          })
        } else {
          console.log(data);
          res.send({
            user: data[0],
            phone: data[1]
          })
        }
      })
      .catch(err => res.send(err))
    }
}
