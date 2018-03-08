var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should()
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhbmRyZXciLCJlbWFpbCI6ImFuZHJld0BnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJhbmRyZXciLCJmYW1pbHlOYW1lIjoiYW5kcmV3Iiwic2V4IjoiTSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE1MjA0ODQ4MDV9.sHp1cqV8bDOpzTY2IUJ2Tz0mFmqQrTl5218o6W-6EoQ'

chai.use(chaiHttp);


describe('test win', ()=>{
  it('successfully read all win', function (done) {
    chai.request('http://localhost:3000')
    .get('/win')
    .end((err,res) => {
      res.should.have.status(200)
      res.should.be.a('object');

      done()
    })
  })

  it('successfully read all win byuser', function (done) {
    chai.request('http://localhost:3000')
    .get('/win/user')
    .set('token', token)
    .end((err,res) => {
      res.should.have.status(200)
      res.should.be.a('object');

      done()
    })
  })

  it('successfully create win', function (done) {
    chai.request('http://localhost:3000')
    .post(`/win`)
    .set('token', token)
    .send({
      star: '5'
    })
    .end((err,res) => {
      res.should.have.status(200);

      res.should.be.json;
      res.should.be.a('object');

      res.body.should.have.property('msg').eql('user free keys updated');

      
      id = res.body.id
      done()
    })
  })

})
