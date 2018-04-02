const jwt = require('jsonwebtoken')
const model = require('../models')

module.exports = {
  addKey(req, res){

    var email1 = req.body.email
    var user = email1.split('@')[0]
    var provider = email1.split('@')[1]
  
    if (provider == 'gmail.com') {
      let userWithoutDot = user.split('.').join('')
      var result = userWithoutDot + '@gmail.com'
      var emailFilter = result
    } else {
      var emailFilter = email1
    } 

    model.user.findOne({
      where: {
        email: emailFilter
      }
    })
    .then(dataUser => {
      if (dataUser == null) {
        res.send({
          message: 'username or email not found'
        })
      } else {
        var key = parseInt(dataUser.aladinKeys) + parseInt(req.body.key)
        model.user.update({
          aladinKeys: key
        },{
          where:{
            id: dataUser.id
          }
        })
        .then((result) => {
          res.send(result)
        })
        .catch(error =>res.status(400).send(error));
      }
    })
    .catch(err => {
      return res.send(err)
    })
  },
}