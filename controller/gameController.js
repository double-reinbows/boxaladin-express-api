const db = require('../models');
const jwt = require('jsonwebtoken');
const { genRandomString } = require('../helpers/string');

module.exports = {

  play: (req, res) => {
    let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
    db.user.findOne({
      where: {
        id: decoded.id,
        emailVerified: true,
      }
    })
    .then(user => {
      if (!user) {
        return res.status(200).send({message: 'Verify Email'});
      }
      // console.log(user.coin,);
      if (user.coin > 0) { //TODO: handle insufficient coin response
        //TODO: handle user has no verified, primary number response
        db.user.update({
          coin: user.coin - 1,
        }, {
          where: {
            id: user.id,
          }
        })
        db.gamecount.findOne()
        .then((gc) => {
          // console.log('CUNT', gc.dataValues);
          db.gamecount.update({
            count: gc.dataValues.count + 1,
          }, {
            where: {
              id: gc.dataValues.id,
            }
          });
          // if (gc) {
          if (((gc.dataValues.count + 1) >= 200) && ((gc.dataValues.count + 1) % 200 === 0)) {
            const winToken = genRandomString(128);
            db.win.create({
              userId: decoded.id,
              gameRuleId: [4, 5], //TODO: maybe randomise on gamerule and tell frontend what User won
              winToken: winToken,
            })
            .then((data) => {
              return res.status(200).send({message: 'Win', winToken: data.winToken, winType: data.gameRuleId});
            });
          } else if (((gc.dataValues.count + 1) >= 100) && ((gc.dataValues.count + 1) % 100 === 0)) {
            const winToken = genRandomString(128);
            let winOptions = [4, 5];
            db.win.create({
              userId: decoded.id,
              gameRuleId: winOptions[Math.floor(Math.random()*winOptions.length)], //TODO: maybe randomise on gamerule and tell frontend what User won
              winToken: winToken,
            })
            .then((data) => {
              return res.status(200).send({message: 'Win', winToken: data.winToken, winType: data.gameRuleId});
            });
          } else if (((gc.dataValues.count + 1) >= 50) && ((gc.dataValues.count + 1) % 50 === 0)) {
            const winToken = genRandomString(128);
            let winOptions = [4, 5];
            db.win.create({
              userId: decoded.id,
              gameRuleId: winOptions[Math.floor(Math.random()*winOptions.length)], //TODO: maybe randomise on gamerule and tell frontend what User won
              winToken: winToken,
            })
            .then((data) => {
              return res.status(200).send({message: 'Win', winToken: data.winToken, winType: data.gameRuleId});
            });
          } else {
            // console.log('SUCK SHIT LOL!');
            return res.status(200).send({message: 'Lose'});
          }
        })
      } else {
        return res.status(200).send({message: 'Cannot Play'});
      }
    }).catch(err => res.send(err));
  },

}
