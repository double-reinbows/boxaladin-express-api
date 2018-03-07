var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should()

chai.use(chaiHttp);


describe('test category', ()=>{
  it('successfully create new category', function (done) {
    chai
    .request('http://localhost:3000')
    .post('/api/category')
    .send({
      categoryName: 'asus'
    })
    .end((err,res) => {
      res.should.have.status(201);

      res.should.be.json;
      res.should.be.a('object');
            
      res.body.should.have.property("categoryName");
      res.body.categoryName.should.equal('asus');
      res.body.categoryName.should.be.a('String');
      id = res.body.id
      done()
    })
  })

  it('successfully read all category', function (done) {
    chai.request('http://localhost:3000')
    .get('/api/category')
    .end((err,res) => {
      res.should.have.status(201)
      done()
    })
  })

  it('successfully update category', function (done) {
    chai.request('http://localhost:3000')
    .put(`/api/category/` + id)
    .send({
      categoryName: 'acer'
    })
    .end((err,res) =>{
      res.should.have.status(200);
      res.should.be.json;
      res.should.be.a('object');   
      res.body.should.have.property('categoryName');
      res.body.categoryName.should.equal('acer');
      done()
    })
  })

  it('successfully delete category', function(done) {
    chai.request('http://localhost:3000')
    .delete(`/api/category/` + id)
    .end((err,res) =>{
      res.should.have.status(200)
      res.body.should.not.have.property('categoryName')
      done()
    })
  })

})
