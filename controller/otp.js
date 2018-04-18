const db = require('../models')
module.exports = {

  sentOtp(req, res, json){
    console.log('tes', req.body.phonenumber)
    console.log('tes2', json)
    var otpFinal = json.token.slice(7)
    console.log(otpFinal)
    db.phonenumber.update({
      otp: otpFinal
    },{
      where: {
        number: req.body.phonenumber
      }
    })
    .then(dataPhone => {
      console.log('otp sent')
    })
    .catch(err => res.send(err))
  }
}