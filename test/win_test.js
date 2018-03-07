var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should()

chai.use(chaiHttp);


describe('test win', ()=>{
  // it('successfully create new win', function (done) {
  //   chai.request('http://localhost:3000')
  //   .post('/api/win')
  //   .send({
  //     winName: 'mouse'
  //   })
  //   .end((err,res) => {
  //     res.should.have.status(201);

  //     res.should.be.json;
  //     res.should.be.a('object');

  //     res.body.should.have.property("winName");
  //     res.body.winName.should.equal('mouse');
  //     res.body.winName.should.be.a('String');
      
  //     id = res.body.id
  //     done()
  //   })
  // })

  it('successfully read all win', function (done) {
    chai.request('http://localhost:3000')
    .get('/user')
    .end((err,res) => {
      res.should.have.status(201)
      done()
    })
  })

  // it('successfully update win', function (done) {
  //   chai.request('http://localhost:3000')
  //   .put(`/api/win/` + id)
  //   .send({
  //     winName: 'asd'
  //   })
  //   .end((err,res) =>{
  //     res.should.have.status(200);
  //     res.should.be.json;
  //     res.should.be.a('object');   
  //     res.body.should.have.property('winName');
  //     res.body.winName.should.equal('asd');
  //     done()
  //   })
  // })

})
