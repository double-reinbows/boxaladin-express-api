var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should()

chai.use(chaiHttp);


describe('test transaction', ()=>{
  it('successfully create new transaction', function (done) {
    chai.request('http://localhost:3000')
    .post('/transaction')
    .send({
      userId: '1',
      paymentId: '1',
      productId: '1',
      aladinPrice: '10000',
      number: '08121377713',
      status: 'PENDING'
    })
    .end((err,res) => {
      res.should.have.status(201);   
      res.body.should.have.property("userId");
      res.body.userId.should.equal('1');
      res.body.userId.should.be.a('Integer');
      res.body.should.have.property("paymentId");
      res.body.paymentId.should.equal('1');
      res.body.paymentId.should.be.a('Integer');
      res.body.should.have.property("productId");
      res.body.productId.should.equal('1');
      res.body.productId.should.be.a('Integer');
      res.body.should.have.property("aladinPrice");
      res.body.aladinPrice.should.equal('10000');
      res.body.aladinPrice.should.be.a('Integer');
      res.body.should.have.property("number");
      res.body.number.should.equal('08121377713');
      res.body.number.should.be.a('Integer');
      res.body.should.have.property("status");
      res.body.status.should.equal('PENDING');
      res.body.status.should.be.a('Integer');

      id = res.body.id
      done()
    })
  })

  it('successfully read all transaction', function (done) {
    chai.request('http://localhost:3000')
    .get('/transaction')
    .end((err,res) => {
      res.should.have.status(201)
      done()
    })
  })

  it('successfully delete transaction', function(done) {
    chai.request('http://localhost:3000')
    .delete(`/api/brand/` + id)
    .end((err,res) =>{
      res.should.have.status(200)
      res.body.should.not.have.property('userId')
      res.body.should.not.have.property('paymentId')
      res.body.should.not.have.property('productId')
      res.body.should.not.have.property('aladinPrice')
      res.body.should.not.have.property('number')
      res.body.should.not.have.property('status')

      done()
    })
  })

})
