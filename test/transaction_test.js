var chai = require("chai");
var chaiHttp = require("chai-http");
var should = chai.should();
var payment = require('../controller/payment')
var modelPayment = require('../models').payment;
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhbmRyZXciLCJlbWFpbCI6ImFuZHJld0BnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJhbmRyZXciLCJmYW1pbHlOYW1lIjoiYW5kcmV3Iiwic2V4IjoiTSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE1MjAzMjIyNjR9.ywca-7HPFy5BMdx9sLffb5IOjAvOzPlnnu9ULo2BfpY'

chai.use(chaiHttp);

describe("test transaction", () => {
  before(function(){
    modelPayment.create({
      invoiceId: 1,
      status: "PENDING",
      amount: 50000,
      availableBanks: "[{'name': 'BCA', 'number':'123'}, {'name': 'BCA', 'number':'123'}]"
    })
    .then((data) => {
      console.log(data)
    })
  });
  it("successfully create new transaction", function(done) {
    chai
      .request("http://localhost:3000")
      .post("/transaction")
      .set('token', token)
      .send({
        paymentId: 2,
        productId: 2,
        aladinPrice: 50000,
        phoneNumber: '6282297677300',
        status: "PENDING"
      })
      .end((err, res) => {
        res.should.have.status(200);

        res.body.should.have.property("paymentId");
        res.body.paymentId.should.equal(2);
        res.body.paymentId.should.be.a("Number");

        res.body.should.have.property("productId");
        res.body.productId.should.equal(2);
        res.body.productId.should.be.a("Number");

        res.body.should.have.property("userId");
        res.body.userId.should.equal(4);
        res.body.userId.should.be.a("Number");

        res.body.should.have.property("aladinPrice");
        res.body.aladinPrice.should.equal(50000);
        res.body.aladinPrice.should.be.a("Number");

        res.body.should.have.property("number");
        res.body.number.should.equal('6282297677300');
        res.body.number.should.be.a("String");

        res.body.should.have.property("status");
        res.body.status.should.equal("PENDING");
        res.body.status.should.be.a("String");

        id = res.body.id;
        done();
      });
  });

  it("successfully read all transaction with Pending user", function(done) {
    chai
      .request("http://localhost:3000")
      .get("/transaction/userPending")
      .set('token', token)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

//   it("successfully update brand", function(done) {
//     chai
//       .request("http://localhost:3000")
//       .put(`/api/brand/` + id)
//       .send({
//         brandName: "asd"
//       })
//       .end((err, res) => {
//         res.should.have.status(2s00);
//         res.should.be.json;
//         res.should.be.a("object");
//         res.body.should.have.property("brandName");
//         res.body.brandName.should.equal("asd");
//         done();
//       });
//   });

//   it("successfully delete brand", function(done) {
//     chai
//       .request("http://localhost:3000")
//       .delete(`/api/brand/` + id)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.not.have.property("brandName");
//         done();
//       });
//   });
});
