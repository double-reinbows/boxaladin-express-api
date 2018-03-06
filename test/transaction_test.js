// var chai = require("chai");
// var chaiHttp = require("chai-http");
// var should = chai.should();
// const jwt = require("jsonwebtoken");
// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0aG9yaXEiLCJlbWFpbCI6InRob3JpcW5mYWl6YWxAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoidGhvcmlxIiwiZmFtaWx5TmFtZSI6ImZhaXphbCIsInNleCI6Ik0iLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNTIwMzExNDIyfQ.mLx76hhR3dKunFTOqNOVQlPNzL_Y6WOyndCUmReDMSQ";

// var decoded = jwt.verify(token, process.env.JWT_SECRET);

// chai.use(chaiHttp);

// describe("test brand", () => {
//   it("successfully create new brand", function(done) {
//     chai
//       .request("http://localhost:3000")
//       .post("/transaction")
//       .send({
//         paymentId: 2,
//         productId: 2,
//         userId: decoded.id,
//         aladinPrice: 10500,
//         number: 082297677300,
//         status: "pending"
//       })
//       .end((err, res) => {
//         // res.should.have.status(201);

//         res.body.should.have.property("paymentId");
//         res.body.paymentId.should.equal(2);
//         res.body.paymentId.should.be.a("Number");

//         res.body.should.have.property("productId");
//         res.body.productId.should.equal(2);
//         res.body.productId.should.be.a("Number");

//         res.body.should.have.property("userId");
//         res.body.userId.should.equal(2);
//         res.body.userId.should.be.a("Number");

//         res.body.should.have.property("aladinPrice");
//         res.body.aladinPrice.should.equal(2);
//         res.body.aladinPrice.should.be.a("String");

//         res.body.should.have.property("number");
//         res.body.number.should.equal("082297677300");
//         res.body.number.should.be.a("String");

//         res.body.should.have.property("status");
//         res.body.status.should.equal("pending");
//         res.body.status.should.be.a("String");

//         id = res.body.id;
//         done();
//       });
//   });

//   it("successfully read user pending", function(done) {
//     chai
//       .request("http://localhost:3000")
//       .get("/api/brand")
//       .end((err, res) => {
//         res.should.have.status(201);
//         done();
//       });
//   });

//   it("successfully read alluser", function(done) {
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

//   it("successfully read 1 user", function(done) {
//     chai
//       .request("http://localhost:3000")
//       .delete(`/api/brand/` + id)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.not.have.property("brandName");
//         done();
//       });
//   });
// });
