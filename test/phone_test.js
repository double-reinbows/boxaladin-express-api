var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should()
var modelPhonenumber = require("../models").phonenumber;
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXphaGFyc29ueSIsImVtYWlsIjoidGV6YWhhcnNvbnkyMzAzOTRAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoidGVqYSIsImZhbWlseU5hbWUiOiJoYXJzb255Iiwic2V4IjoiTSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE1MjA0MTQ5NjV9.JGzHtH1wWs1Z7SgBP6UQEl9SuWn8R_782y4ZwTHGpbM";

var randomz =  6282212341234 + Math.floor(Math.random() * 1000);
var randomzz = randomz.toString();
chai.use(chaiHttp);

// kalo mau ngetest create new phone number ganti res.send otp controller, postPhoneNUmber. 
// di res.send yang isi message dan data di ganti data.dataValues jangan object

describe('test phone', ()=>{
  // before(function() {
  //   modelPhonenumber.create({
  //     userId: 2,
  //     number: "6282297677300",
  //     verified: true,
  //     primary: true,
  //     otp: "680926"
  //   });
  // });

  //get allphone
  it('successfully read all phone', function (done) {
    chai.request('http://localhost:3000')
    .get('/allphone')
    .end((err,res) => {
      res.should.have.status(200)
      done();
    })
  })
  
  //get phoneNumbers
  // it("successfully read 1 phoneNumbers", function(done) {
  //   chai
  //     .request("http://localhost:3000")
  //     .get('/phoneNumbers')
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       done();
  //     });
  // })

  //post phonenumber
  
  it("successfully post new phonenumber", function(done) {
    chai
      .request("http://localhost:3000")
      .post("/phonenumber")
      .set("token", token)
      .send({
        userId: 1,
        phonenumber: randomzz,
        verified: false,
        primary: false,
        otp: 680926
      })
      .end((err, res) => {
        res.should.have.status(200);

        res.should.be.a("object");
        res.should.be.json;

        res.body.should.have.property("userId");
        res.body.userId.should.equal(1);
        res.body.userId.should.be.a("Number");

        res.body.should.have.property("number");
        res.body.number.should.equal(randomzz);
        res.body.number.should.be.a("String");

        res.body.should.have.property("verified");
        res.body.verified.should.equal(false);
        res.body.verified.should.be.a("Boolean");

        res.body.should.have.property("primary");
        res.body.primary.should.equal(false);
        res.body.primary.should.be.a("Boolean");



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
  

  //delete /phone/id
  it('successfully delete phone', function (done) {
    chai.request('http://localhost:3000')
    .delete(`/phone/` + id)
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.not.have.property('userId');
      res.body.should.not.have.property("phonenumber");
      res.body.should.not.have.property("verified");
      res.body.should.not.have.property("primary");
      res.body.should.not.have.property("otp");
      done();
    })
  })

})
