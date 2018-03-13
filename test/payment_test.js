const chai = require("chai")
const chaiHttp = require("chai-http")
const should = chai.should()
const axios = require('axios')
const db = require('../models/')
const app = require('../app')

chai.use(chaiHttp)

describe('PAYMENT CONTROLLER TESTING', () => {

  var token = null
  var transaction = null

  // before((done) => {
    
  //   axios({
  //     method: 'POST',
  //     url: 'http://localhost:3000/signin',
  //     data: {
  //       username: 'anto',
  //       password: 'boxaladin'
  //     }
  //   })
  //   .then(response => {
  //     token = response.token
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })

  //   // db.transaction.create({
  //   //   // 
  //   // })
  //   // .then(result => {
  //   //   transaction = result
  //   // })
  //   // .catch(err => {
  //   //   console.log(err)
  //   // })

  //   done()

  // })

  // after((done) => {

  //   db.payment.destroy({})
  //   .then(() => {
  //     console.log('ALL DATA TESTING PAYMENT DALETED.')
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })

  //   // db.transaction.destroy({
  //   //   where: {
  //   //     id: transaction.id
  //   //   }
  //   // })
  //   // .then(() => {
  //   //   console.log('ALL DATA TESTING PAYMENT DALETED.')
  //   // })
  //   // .catch(err => {
  //   //   console.log(err)
  //   // })

  //   done()

  // })

  // it('create payment', (done) => {
  //   chai
  //   .request(app)
  //   .post('/payment')
  //   .set('token', token)
  //   .send({
  //     amount: 10000,
  //     productId: 1,
  //     phoneNumber: '6282199142474'
  //   })
  //   .end((err, res) => {
  //     // res.should.have.status(200)
  //     res.should.be.an('Object')
  //   })
  //   done()
  // })

  it('testing', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.an('Array')
      })
    done()
  })

})