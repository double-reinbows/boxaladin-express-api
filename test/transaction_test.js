// var chai = require("chai");
// var chaiHttp = require("chai-http");
// var should = chai.should();
// var payment = require("../controller/payment");
// var modelPayment = require("../models").payment;
// var token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhbmRyZXciLCJlbWFpbCI6ImFuZHJld0BnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJhbmRyZXciLCJmYW1pbHlOYW1lIjoiYW5kcmV3Iiwic2V4IjoiTSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE1MjAzOTc2Mjh9.tkm5Grgwzd_jkqtqKNaimGZQhY97UW37BmTPfHtgaoI";

// describe("test transaction", () => {
//   before(function() {
//     modelPayment.create({
//       invoiceId: 1,
//       status: "PENDING",
//       amount: 50000,
//       availableBanks:
//         "[{'name': 'BCA', 'number':'123'}, {'name': 'BCA', 'number':'123'}]"
//     });
//   });
//   it("successfully create new transaction", function(done) {
//     chai
//       .request("http://localhost:3000")
//       .post("/transaction")
//       .set("token", token)
//       .send({
//         paymentId: 2,
//         productId: 2,
//         aladinPrice: 50000,
//         phoneNumber: "6282297677300",
//         status: "PENDING"
//       })
//       .end((err, res) => {
//         res.should.have.status(200);

//         res.body.should.have.property("userId");
//         res.body.userId.should.equal(4);
//         res.body.userId.should.be.a("Number");

//         res.body.should.have.property("aladinPrice");
//         res.body.aladinPrice.should.equal(50000);
//         res.body.aladinPrice.should.be.a("Number");

//         res.body.should.have.property("number");
//         res.body.number.should.equal("6282297677300");
//         res.body.number.should.be.a("String");

//         res.body.should.have.property("status");
//         res.body.status.should.equal("PENDING");
//         res.body.status.should.be.a("String");

//         id = res.body.id;
//         done();
//       });
//   });

//   it("successfully read all transaction with Pending user", function(done) {
//     chai
//       .request("http://localhost:3000")
//       .get("/transaction/userPending")
//       .set("token", token)
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   });

//   it("successfully read alluser", function(done) {
//     chai
//       .request("http://localhost:3000")
//       .get(`/transaction/user`)
//       .set("token", token)
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   });

//   //   it("successfully delete 1 user", function(done) {
//   //     chai
//   //       .request("http://localhost:3000")
//   //       .delete(`/api/brand/` + id)
//   //       .end((err, res) => {
//   //         res.should.have.status(200);
//   //         res.body.should.not.have.property("brandName");
//   //         done();
//   //       });
//   //   });
// });
