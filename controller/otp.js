const db = require('../models')
module.exports = {

  sentOtp(req, res, json){
    console.log('tes', req.body.phonenumber)
    console.log('tes2', json)

    var phone = json.token
    var splitNumber = phone.split('')

    if (splitNumber[0] === '0') {
      splitNumber.splice(0, 1, '0')
      var newNumber = splitNumber.join('')
    } else if (splitNumber[0] + splitNumber[1] + splitNumber[2] === '+62') {
      splitNumber.splice(0, 3, '0')
      var newNumber = splitNumber.join('')
    } else if (splitNumber[0] + splitNumber[1] === '62') {
      splitNumber.splice(0, 2, '0')
      var newNumber = splitNumber.join('')
    } else if (splitNumber.length === 0) {
      var newNumber = splitNumber.join('')
    } else {
      var newNumber = phone
    }
    var otpFinal = newNumber.slice(7)
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
    // .catch(err => res.send(err))
  }
}