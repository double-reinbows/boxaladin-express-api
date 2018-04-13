var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cors = require('cors')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var isDevelop = process.env.NODE_ENV || 'development';
var envPath = isDevelop ? path.resolve('.env.dev') : path.resolve('.env');
console.log('author: ',process.env.AUTHOR);
console.log('envPath: ',envPath);
require('dotenv').config({path: envPath})
var firebase = require('firebase')
var admin = require("firebase-admin")
var xmlparser = require('express-xml-bodyparser')

// Initialize Firebase Admin
var serviceAccount = require("./boxaladin-auction-firebase-adminsdk-kr4x0-a14e997d4b.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://boxaladin-auction.firebaseio.com"
})

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDjiWTez3r_lZreCZUvIUhaSj8-rIWfhgw",
  authDomain: "boxaladin-auction.firebaseapp.com",
  databaseURL: "https://boxaladin-auction.firebaseio.com",
  projectId: "boxaladin-auction",
  storageBucket: "boxaladin-auction.appspot.com",
  messagingSenderId: "912503242137"
};
firebase.initializeApp(config);

var index = require('./routes/index');
var users = require('./routes/users');
var win = require('./routes/win');
var reward = require('./routes/reward');
var claim = require('./routes/claim');
var admin = require('./routes/admin');
var lose = require('./routes/gamecount');

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(xmlparser());
app.use(bodyParser.text());


app.use('/', index);
app.use('/users', users);
app.use('/win', win);
app.use('/reward', reward);
app.use('/claim', claim);
app.use('/admin', admin);
app.use('/lose', lose);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
