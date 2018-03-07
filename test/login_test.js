var chai = require("chai");
var chaiHttp = require("chai-http");
var should = chai.should();

chai.use(chaiHttp);

// untuk tes login bagian controller signin res.send token diganti jadi user.dataValues dan jangan dijadiin object

describe("test login", () => {
  it("successfully login", function(done) {
    chai
      .request("http://localhost:3000")
      .post("/signin")
      .send({
        username: "thoriq",
        password: "ByqHEq39e90dbfb42f0f56960086bc6dd62670"
      })
      .end((err, res) => {
        res.should.have.status(200);

        // res.should.be.json;
        // res.should.be.a('object');

        res.body.should.have.property("username");
        res.body.username.should.equal("thoriq");
        res.body.username.should.be.a("String");

        res.body.should.have.property("password");
        res.body.password.should.equal("ByqHEq39e90dbfb42f0f56960086bc6dd62670");
        res.body.password.should.be.a("String");

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