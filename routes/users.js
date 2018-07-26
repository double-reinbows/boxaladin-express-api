var express = require('express');
var router = express.Router();

const auth = require('../helpers/auth')
const ctrl = require('../controller/userCtrl')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/info', ctrl.getUser)
router.get('/checkuser', auth.isLogin, auth.isVerified, ctrl.checkUser)
router.get('/token', ctrl.refreshToken)
router.get('/:username', auth.authUser, ctrl.getUserData)

router.put('/coin', ctrl.decreaseCoin)
router.put('/upcoin', ctrl.buyCoinWithAladinKey)

module.exports = router;
