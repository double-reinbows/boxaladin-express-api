var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should()
var modelPhonenumber = require("../models").phonenumber;
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhbmRyZXciLCJlbWFpbCI6ImFuZHJld0BnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJhbmRyZXciLCJmYW1pbHlOYW1lIjoiYW5kcmV3Iiwic2V4IjoiTSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE1MjAzOTc2Mjh9.tkm5Grgwzd_jkqtqKNaimGZQhY97UW37BmTPfHtgaoI";


chai.use(chaiHttp);


describe('test phone', ()=>{
  before(function() {
    modelPhonenumber.create({
      userId: 1,
      number: "082297677300",
      verified: true,
      primary: true,
      otp: 1234
    });
  });
  //get allphone
  it('successfully read all phone', function (done) {
    chai.request('http://localhost:3000')
    .get('/allphone')
    .end((err,res) => {
      res.should.have.status(200)
      done()
    })
  })
  
  //get phoneNumbers
  // it("successfully read all phone", function(done) {
  //   chai
  //     .request("http://localhost:3000")
  //     .get("/allphone")
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       done();
  //     });
  // })

  //post phonenumber
  
  it("successfully create new transaction", function(done) {
    chai
      .request("http://localhost:3000")
      .post("/transaction")
      .set("token", token)
      .send({
        paymentId: 2,
        productId: 2,
        aladinPrice: 50000,
        phoneNumber: "6282297677300",
        status: "PENDING"
      })
      .end((err, res) => {
        res.should.have.status(200);

        res.body.should.have.property("userId");
        res.body.userId.should.equal(4);
        res.body.userId.should.be.a("Number");

        res.body.should.have.property("aladinPrice");
        res.body.aladinPrice.should.equal(50000);
        res.body.aladinPrice.should.be.a("Number");

        res.body.should.have.property("number");
        res.body.number.should.equal("6282297677300");
        res.body.number.should.be.a("String");

        res.body.should.have.property("status");
        res.body.status.should.equal("PENDING");
        res.body.status.should.be.a("String");

        id = res.body.id;
        done();
      });
  });

  //post changePrimary
  // it('successfully read all phone', function (done) {
  //   chai.request('http://localhost:3000')
  //   .get('/allphone')
  //   .end((err,res) => {
  //     res.should.have.status(200)
  //     done()
  //   })
  // })

  //post smsVerification
  // it('successfully read all phone', function (done) {
  //   chai.request('http://localhost:3000')
  //   .get('/allphone')
  //   .end((err,res) => {
  //     res.should.have.status(200)
  //     done()
  //   })
  // })

  //post phoneVerification
  // it('successfully read all phone', function (done) {
  //   chai.request('http://localhost:3000')
  //   .get('/allphone')
  //   .end((err,res) => {
  //     res.should.have.status(200)
  //     done()
  //   })
  // })
  
  //put /phone/:id
  // it('successfully read all phone', function (done) {
  //   chai.request('http://localhost:3000')
  //   .get('/allphone')
  //   .end((err,res) => {
  //     res.should.have.status(200)
  //     done()
  //   })
  // })

  //delete /phone/id
  // it('successfully read all phone', function (done) {
  //   chai.request('http://localhost:3000')
  //   .get('/allphone')
  //   .end((err,res) => {
  //     res.should.have.status(200)
  //     done()
  //   })
  // })

})
