// var chai = require('chai');
// var chaiHttp = require('chai-http');
// var should = chai.should()

// chai.use(chaiHttp);


// describe('test product', ()=>{
//   it('successfully create new product', function (done) {
//     chai.request('http://localhost:3000')
//     .post('/api/product')
//     .send({
//       categoryId: 2,
//       brandId: 2,
//       productName: 'pulsa telkomsel 10rb',
//       description:'asd',
//       stock:1,
//       price:10500,
//       aladinPrice:10500,
//       pulsaCode:'htelkomsel'
//     })
//     .end((err,res) => {
//       res.should.have.status(201);

//       res.body.should.have.property("categoryId");
//       res.body.categoryId.should.equal(2);
//       res.body.categoryId.should.be.a("Number");

//       res.body.should.have.property("brandId");
//       res.body.brandId.should.equal(2);
//       res.body.brandId.should.be.a("Number");
      
//       res.body.should.have.property("productName");
//       res.body.productName.should.equal("pulsa telkomsel 10rb");
//       res.body.productName.should.be.a("String");

//       res.body.should.have.property("description");
//       res.body.description.should.equal("asd");
//       res.body.description.should.be.a("String");
      
//       res.body.should.have.property("stock");
//       res.body.stock.should.equal(1);
//       res.body.stock.should.be.a("Number");

//       res.body.should.have.property("price");
//       res.body.price.should.equal(10500);
//       res.body.price.should.be.a("Number");

//       res.body.should.have.property("aladinPrice");
//       res.body.aladinPrice.should.equal(10500);
//       res.body.aladinPrice.should.be.a("Number");
      
//       // res.body.should.have.property("pulsaCode");
//       // res.body.pulsaCode.should.equal("htelkomsel");
//       // res.body.pulsaCode.should.be.a("String");

//       id = res.body.id
//       done()
//     })
//   })

//   it('successfully read all product', function (done) {
//     chai.request('http://localhost:3000')
//     .get('/api/product')
//     .end((err,res) => {
//       res.should.have.status(200)
//       done()
//     })
//   })

//   it('successfully update product', function (done) {
//     chai
//       .request("http://localhost:3000")
//       .put(`/api/product/` + id)
//       .send({
//         categoryId: 2,
//         brandId: 2,
//         productName: "pulsa telkomsel 25rb",
//         description: "asd",
//         stock: 1,
//         price: 10500,
//         aladinPrice: 25000,
//         pulsaCode: "htelkomsel"
//       })
//       .end((err, res) => {
//        res.should.have.status(200);

//        res.body.should.have.property("categoryId");
//        res.body.categoryId.should.equal(2);
//        res.body.categoryId.should.be.a("Number");

//       //  res.body.should.have.property("brandId");
//       //  res.body.brandId.should.equal(2);
//       //  res.body.brandId.should.be.a("Number");

//       //  res.body.should.have.property("productName");
//       //  res.body.productName.should.equal("pulsa telkomsel 25rb");
//       //  res.body.productName.should.be.a("String");

//       //  res.body.should.have.property("description");
//       //  res.body.description.should.equal("asd");
//       //  res.body.description.should.be.a("String");

//       //  res.body.should.have.property("stock");
//       //  res.body.stock.should.equal(1);
//       //  res.body.stock.should.be.a("Number");

//       //  res.body.should.have.property("price");
//       //  res.body.price.should.equal(10500);
//       //  res.body.price.should.be.a("Number");

//       //  res.body.should.have.property("aladinPrice");
//       //  res.body.aladinPrice.should.equal(10500);
//       //  res.body.aladinPrice.should.be.a("Number");

//        id = res.body.id;
//        done()
//       });
//   })

//   it('successfully delete brand', function(done) {
//     chai.request('http://localhost:3000')
//     .delete(`/api/product/` + id)
//     .end((err,res) =>{
//       res.should.have.status(200);
//       res.body.should.not.have.property("categoryId");
//       res.body.should.not.have.property("brandId");
//       res.body.should.not.have.property("productName");
//       res.body.should.not.have.property("description");
//       res.body.should.not.have.property("stock");
//       res.body.should.not.have.property("price");
//       res.body.should.not.have.property("aladinPrice");
//       res.body.should.not.have.property("pulsaCode");

//       done()
//     })
//   })

// })
