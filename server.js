var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/mistufs';
var db = mongoose.connect(connectionString);

var PhoneSchema = new mongoose.Schema({
  phone_name: String,
  phone_number: String
});

var LocationSchema = new mongoose.Schema({
  location_name: String,
  location_description: String,
  location_details: String
});

var CommentSchema = new mongoose.Schema({
  srcUserId: String,
  bodyPublic: String,
  created: { type: Date, default: Date.now }
});


var ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String
});
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  roles: [String],
  firstName: String,
  lastName: String,
  address1: String,
  address2: String,
  profilePicture: String,
  city: String,
  state: String,
  zip: String,

  friends: [String],
  phone: [PhoneSchema],
  locations: [LocationSchema],  
  pubComments: [CommentSchema],
  items: [ItemSchema]

});





var UserModel = mongoose.model('UserModel', UserSchema);

//var favorites = new Array();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));// GET /style.css etc

passport.use(new LocalStrategy(
  function (username, password, done) {
    //CALL TO DATABASE AND VERIFY THAT USERNAME/PASSWORD MATCH A VALUE
    UserModel.findOne({ username: username, password: password }, function (err, user) {
      //console.log(docs);
      if (user) {
        return done(null, user);
      }
      return done(null, false, { message: 'Unable to login' });
    });

  }));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

var auth = function (req, res, next) {
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
};

app.get('/hello', function (req, res) {
  res.send('hello world');
});

app.get('/loggedin', function (req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

app.get('/rest/user', auth, function (req, res) {
  UserModel.find(function (err, users) {
    res.json(users);
  });
});

app.post('/rest/delUser', auth, function (req, res) {
  console.log("server - delUser REST");
  console.log(req.body);
  UserModel.remove({ _id: req.body._id }, function (err, users) {
    res.json(users);
  });
});

//right now only replaces pubData in Mongo - will need to edit for entire schema/etc
app.post("/api/updateUser", auth, function (req, res) {
  console.log("server - updateUser REST");
  console.log(req.body);
  UserModel.findOneAndUpdate({ _id: req.body._id }, { pubData: req.body.pubData }, function (err, user) {
    if (err) throw err;
    // we have the updated user returned to us
    console.log(user);
    //res.json(user);
  });
});


app.post('/rest/addComment', auth, function (req, res) {
  console.log("rest/addComment/ req::");

  //console.log(req.body.params._id);
  destUIDloc = req.body.params._id;
  //console.log(destUIDloc);
  bodyPublicloc = req.body.params.bodyPublic;
  //console.log(bodyPublicloc);
  srcUserNameloc = req.user.username;
  //console.log(srcUserNameloc);
  entry = { srcUserName: srcUserNameloc, bodyPublic: bodyPublicloc };
  console.log("ENTRY:::");
  console.log(entry);

  UserModel.findOneAndUpdate({ _id: destUIDloc }, { $addToSet: { pubComments: entry } }, function (err, user) {
    if (err) throw err;
    // we have the updated user returned to us
    console.log(user);
    return user;
  });
});

app.get('/rest/pubComments', auth, function (req, res) {
  UserModel.findOne({ username: req.user.username }, function (err, user) {
    console.log(user.username);
    if (user) {
      console.log(user.pubComments);
      res.json(user.pubComments);
    }
    console.log("Unable to Get pubComments");
  });
});



app.post('/login', passport.authenticate('local'), function (req, res) {
  console.log(req.user);
  res.send(req.user);
});

app.post('/register', function (req, res) {
  UserModel.findOne({ username: req.body.username }, function (err, user) {
    if (user) {
      res.send(200);
    }
    else {
      var newUser = new UserModel(req.body);
      newUser.roles = ['admin', 'user'];

      newUser.save(function (err, user) {
        req.login(user, function (err) {
          if (err) { return next(err); }
          res.json(user);
        });
      });
    }
  });
  var newUser = req.body;
  console.log(newUser);
});



app.post('/logout', function (req, res) {
  req.logOut();
  res.send(200);
});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8000;

app.listen(port, ip);
