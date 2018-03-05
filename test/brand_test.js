var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should()

chai.use(chaiHttp);


describe('test brand', ()=>{
  it('successfully create new brand', function (done) {
    chai.request('http://localhost:3000')
    .post('/api/brand')
    .send({
      brandName: 'mouse'
    })
    .end((err,res) => {
      res.should.have.status(201);

      res.should.be.json;
      res.should.be.a('object');

      res.body.should.have.property("brandName");
      res.body.brandName.should.equal('mouse');
      res.body.brandName.should.be.a('String');
      
      id = res.body.id
      done()
    })
  })

  it('successfully read all brand', function (done) {
    chai.request('http://localhost:3000')
    .get('/api/brand')
    .end((err,res) => {
      res.should.have.status(201)
      done()
    })
  })

  it('successfully update brand', function (done) {
    chai.request('http://localhost:3000')
    .put(`/api/brand/` + id)
    .send({
      brandName: 'asd'
    })
    .end((err,res) =>{
      res.should.have.status(200);
      res.should.be.json;
      res.should.be.a('object');   
      res.body.should.have.property('brandName');
      res.body.brandName.should.equal('asd');
      done()
    })
  })

  it('successfully delete brand', function(done) {
    chai.request('http://localhost:3000')
    .delete(`/api/brand/` + id)
    .end((err,res) =>{
      res.should.have.status(200)
      res.body.should.not.have.property('brandName')
      done()
    })
  })

})
