var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should()

chai.use(chaiHttp);


describe('test product', ()=>{
  it('successfully create new product', function (done) {
    chai.request('http://localhost:3000')
    .post('/api/product')
    .send({
      id: '1',
      categoryId: '1',
      brandId: '1',
      productName: 'pulsa telkomsel 10rb',
      description:'asd',
      stock:'1',
      price:'10500',
      aladinPrice:'10000',
      pulsaCode:'htelkomsel'
    })
    .end((err,res) => {
      res.should.have.status(201);

      res.should.be.json;
      res.should.be.a('object');

      res.body.should.have.property("id");
      res.body.id.should.equal('1');
      res.body.id.should.be.a('Integer');

      res.body.should.have.property("categoryId");
      res.body.id.should.equal("1");
      res.body.id.should.be.a("Integer");

      res.body.should.have.property("brandId");
      res.body.id.should.equal("1");
      res.body.id.should.be.a("Integer");
      
      res.body.should.have.property("productName");
      res.body.id.should.equal("pulsa telkomsel 10rb");
      res.body.id.should.be.a("String");

      res.body.should.have.property("description");
      res.body.id.should.equal("asd");
      res.body.id.should.be.a("String");
      
      res.body.should.have.property("stock");
      res.body.id.should.equal("1");
      res.body.id.should.be.a("Integer");

      res.body.should.have.property("Price");
      res.body.id.should.equal("10500");
      res.body.id.should.be.a("Integer");

      res.body.should.have.property("aladinPrice");
      res.body.id.should.equal("10000");
      res.body.id.should.be.a("Integer");
      
      res.body.should.have.property("pulsaCode");
      res.body.id.should.equal("htelkomsel");
      res.body.id.should.be.a("String");

      id = res.body.id
      done()
    })
  })

  it('successfully read all product', function (done) {
    chai.request('http://localhost:3000')
    .get('/api/product')
    .end((err,res) => {
      res.should.have.status(200)
      done()
    })
  })

  it('successfully update product', function (done) {
    chai
      .request("http://localhost:3000")
      .put(`/api/product/` + id)
      .send({
        id: "2",
        categoryId: "2",
        brandId: "2",
        productName: "pulsa telkomsel 25rb",
        description: "asd",
        stock: "1",
        aladinPrice: "25000",
        pulsaCode: "htelkomsel"
      })
      .end((err, res) => {
       res.should.have.status(200);

       res.should.be.json;
       res.should.be.a("object");

       res.body.should.have.property("id");
       res.body.id.should.equal("1");
       res.body.id.should.be.a("Integer");

       res.body.should.have.property("categoryId");
       res.body.id.should.equal("1");
       res.body.id.should.be.a("Integer");

       res.body.should.have.property("brandId");
       res.body.id.should.equal("1");
       res.body.id.should.be.a("Integer");

       res.body.should.have.property("productName");
       res.body.id.should.equal("pulsa telkomsel 10rb");
       res.body.id.should.be.a("Integer");

       res.body.should.have.property("description");
       res.body.id.should.equal("1");
       res.body.id.should.be.a("Integer");

       res.body.should.have.property("id");
       res.body.id.should.equal("1");
       res.body.id.should.be.a("Integer");

       res.body.should.have.property("aladinPrice");
       res.body.id.should.equal("1");
       res.body.id.should.be.a("Integer");

       res.body.should.have.property("pulsaCode");
       res.body.id.should.equal("1");
       res.body.id.should.be.a("Integer");

       id = res.body.id;
      });
  })

  it('successfully delete brand', function(done) {
    chai.request('http://localhost:3000')
    .delete(`/api/product/` + id)
    .end((err,res) =>{
      res.should.have.status(200);
      res.body.should.not.have.property('id');
      res.body.should.not.have.property("categoryId");
      res.body.should.not.have.property("brandId");
      res.body.should.not.have.property("productName");
      res.body.should.not.have.property("description");
      res.body.should.not.have.property("stock");
      res.body.should.not.have.property("aladinPrice");
      res.body.should.not.have.property("pulsaCode");

      done()
    })
  })

})
