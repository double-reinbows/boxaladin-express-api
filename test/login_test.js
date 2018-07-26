const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
// const jwt = require("jsonwebtoken");
// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0aG9yaXEiLCJlbWFpbCI6InRob3JpcW5mYWl6YWxAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoidGhvcmlxIiwiZmFtaWx5TmFtZSI6ImZhaXphbCIsInNleCI6Ik0iLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNTIwMzExNDIyfQ.mLx76hhR3dKunFTOqNOVQlPNzL_Y6WOyndCUmReDMSQ";

// var decoded = jwt.verify(token, process.env.JWT_SECRET);

chai.use(chaiHttp);

describe("test login", () => {
  it("successfully login", function(done) {
    chai
      .request("http://localhost:3000")
      .post("/signin")
      .send({
        email: "sbstn.andrew56@gmail.com",
        password: "boxaladin"
      })
      .end((err, res) => {
        res.should.have.status(200);

        res.should.be.json;
        res.should.be.a('object');

        res.body.should.have.property('message').eql('login success');
        res.body.should.have.property('token')

        id = res.body.id;
        done();
      });
  });

  it("login with wrong password", function(done) {
    chai
      .request("http://localhost:3000")
      .post("/signin")
      .send({
        email: "sbstn.andrew56@gmail.com",
        password: "adasdsafasfasfas"
      })
      .end((err, res) => {
        res.should.have.status(200);

        res.should.be.json;
        res.should.be.a('object');
        res.body.should.have.property('message').eql('password incorrect');

        id = res.body.id;
        done();
      });
  });

  it("login with wrong username", function(done) {
    chai
      .request("http://localhost:3000")
      .post("/signin")
      .send({
        email: "andrewa",
        password: "boxaladin"
      })
      .end((err, res) => {
        res.should.have.status(200);

        res.should.be.json;
        res.should.be.a('object');
        res.body.should.have.property('message').eql('email not found');


        id = res.body.id;
        done();
      });
  });

  it("successfully read all users", function(done) {
    chai
      .request("http://localhost:3000")
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});