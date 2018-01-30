var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should()

chai.use(chaiHttp);

 var number= 0812345678
describe('test user', ()=>{
  it('successfully create new user', function (done) {
    chai.request('http://localhost:3000')
    .post('/signup')
    .send({
      username: 'user6',
      password: 'boxaladin',
      email: 'test@gmai.com',
      firstName: 'user',
      familyName: 'aaa',
      sex: 'M',
      // number: '0812345678'
    })
    .end((err,res) => {
      res.should.have.status(200)
      res.body.should.have.property("username");
      res.body.username.should.equal('user6');
      res.body.username.should.be.a('String');
      res.body.should.have.property("password");
      res.body.password.should.equal('boxaladin');
      res.body.password.should.be.a('String');
      res.body.should.have.property("email");
      res.body.email.should.equal('test@gmail.com');
      res.body.email.should.be.a('String');
      res.body.should.have.property("firstName");
      res.body.firstName.should.equal('user');
      res.body.firstName.should.be.a('String');
      res.body.should.have.property("familyName");
      res.body.familyName.should.equal('aaa');
      res.body.familyName.should.be.a('String');
      res.body.should.have.property("sex");
      res.body.sex.should.equal('M');
      res.body.sex.should.be.a('String');
      // res.body.should.have.property("number");
      // res.body.number.should.equal('0812345678');
      // res.body.number.should.be.a('integer');
      
      id = res.body.id
      done()
    })
  })

  it('successfully read all users', function (done) {
    chai.request('http://localhost:3000')
    .get('/')
    .end((err,res) => {
      res.should.have.status(200)
      done()
    })
  })

  it('successfully read user by id', function (done) {
    chai.request('http://localhost:3000')
    .get(`/` + id)
    .end((err,res) => {
      res.should.have.status(200)
      done()
    })
  })

  it('successfully delete user', function(done) {
    chai.request('http://localhost:3000')
    .delete(`/` +id)
    .end((err,res) =>{
      res.should.have.status(200)
      res.body.should.not.have.property('username')
      res.body.should.not.have.property('password')
      res.body.should.not.have.property('email')
      res.body.should.not.have.property('firstName')
      res.body.should.not.have.property('familyName')
      res.body.should.not.have.property('sex')

      done()
    })
  })

})
