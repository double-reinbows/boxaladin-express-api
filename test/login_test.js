// var chai = require("chai");
// var chaiHttp = require("chai-http");
// var should = chai.should();
// // const jwt = require("jsonwebtoken");
// // var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0aG9yaXEiLCJlbWFpbCI6InRob3JpcW5mYWl6YWxAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoidGhvcmlxIiwiZmFtaWx5TmFtZSI6ImZhaXphbCIsInNleCI6Ik0iLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNTIwMzExNDIyfQ.mLx76hhR3dKunFTOqNOVQlPNzL_Y6WOyndCUmReDMSQ";
 
// // var decoded = jwt.verify(token, process.env.JWT_SECRET);

// chai.use(chaiHttp);

// describe("test login", () => {
//   it("successfully login", function(done) {
//     chai
//       .request("http://localhost:3000")
//       .post("/signin")
//       .send({
//         username: "thoriq",
//         password: "qwL9ei39e90dbfb42f0f56960086bc6dd62670"
//       })
//       .end((err, res) => {
//         res.should.have.status(200);

//         // res.should.be.json;
//         // res.should.be.a('object');

//         res.body.should.have.property("username");
//         res.body.username.should.equal("thoriq");
//         res.body.username.should.be.a("String");

//         res.body.should.have.property("password");
//         res.body.password.should.equal("qwL9ei39e90dbfb42f0f56960086bc6dd62670");
//         res.body.password.should.be.a("String");

//         id = res.body.id;
//         done();
//       });
//   });

//   it("successfully read all users", function(done) {
//     chai
//       .request("http://localhost:3000")
//       .get("/")
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   });
// });