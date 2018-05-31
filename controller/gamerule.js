const db = require('../models');
const jwt = require('jsonwebtoken');
module.exports = {

  all: (req, res) => {
    let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
    let grPromise = db.gamerule.findAll();
    db.phonenumber.findOne({
      where: {
        userId: decoded.id,
        primary: true,
        verified: true,
      }
    }).then(data => {
      if (data) {
        console.log('phone number verified');
        db.user.findOne({
          where: {
            id: decoded.id,
            emailVerified: true,
          }
        }).then(userRes => {
          grPromise.then(data => {
            if (!userRes) { //email not verified
              console.log('dick', data);
              return res.send({
                msg: 'Unverified',
                prize1: data[0].dataValues.pulsaAmount,
                prize2: data[1].dataValues.pulsaAmount,
                prize3: data[2].dataValues.pulsaAmount,
                prize4: data[3].dataValues.pulsaAmount,
                prize5: data[4].dataValues.pulsaAmount,
              });
            } else { //everything verified
              return res.send({
                msg: 'Verified',
                prize1: data[0].dataValues.pulsaAmount,
                prize2: data[1].dataValues.pulsaAmount,
                prize3: data[2].dataValues.pulsaAmount,
                prize4: data[3].dataValues.pulsaAmount,
                prize5: data[4].dataValues.pulsaAmount,
              });
            }
          });
        });
      } else { //phone not verified
        grPromise.then(data => {
          return res.send({
            msg: 'Unverified',
            prize1: data[0].dataValues.pulsaAmount,
            prize2: data[1].dataValues.pulsaAmount,
            prize3: data[2].dataValues.pulsaAmount,
            prize4: data[3].dataValues.pulsaAmount,
            prize5: data[4].dataValues.pulsaAmount,
          });
        })
      }
    }).catch(err => {console.log(err)});
  }
}
