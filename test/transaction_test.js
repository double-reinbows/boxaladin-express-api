var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should()

chai.use(chaiHttp);


describe('test transaction', ()=>{
  it('successfully create new transaction', function (done) {
    chai.request('http://localhost:3000')

    .post('/transaction')
    .send({
      userId: 1,
      paymentId: 1,
      productId: 1,
      aladinPrice: 10000,
      number: '08121377713',
      status: 'PENDING'
    })
    .end((err,res) => {
      res.should.have.status(500);   
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
      res.body.number.should.be.a('String');
      res.body.should.have.property("status");
      res.body.status.should.equal('PENDING');
      res.body.status.should.be.a("String");

      id = res.body.id
      done()
    })
  })

  it('successfully read all pending transaction', function (done) {
    chai.request('http://localhost:3000')
    .get('/transaction/userPending')
    .end((err,res) => {
      res.should.have.status(201)
      done()
    })
  })

  it("successfully read user transaction", function(done) {
    chai
      .request("http://localhost:3000")
      .get("/transaction/user")
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  })
  
  it("successfully read id transaction", function(done) {
    chai
      .request("http://localhost:3000")
      .get("/transaction/user/:id")
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });


})
