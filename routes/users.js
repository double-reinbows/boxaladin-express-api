var express = require('express');
var router = express.Router();

const auth = require('../helpers/auth')
const ctrl = require('../controller/userCtrl')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/:username', auth.authUser, ctrl.getUserData)

module.exports = router;
