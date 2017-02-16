var jwt = require('jwt-simple');
var config = require('../../config/config');
var users = require('../controllers/users.js');
//var graph = require('fbgraph');
var FB = require('../config/fbgraph.js');

const User = require('../models').User;

var auth = {

  login: function(req, res) {

    var facebook_token = req.body.facebook_token || '';
    var facebook_id = req.body.facebook_id || '';

    if (facebook_token == '' || facebook_id == '') {
      res.status(401);
      res.json({
        statusCode: 401,
        error: "Invalid credentials"
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    var getUser = auth.getUser(facebook_token, facebook_id);

    if (!getUser) { // If authentication fails, we send a 401 back
      // We need to add the user in DB
      // graph.setAccessToken(facebook_token);
      // var fbUser = graph.get("/me?fields=email,first_name,last_name,gender,verified,locale,timezone,friends,picture.width(720).height(720){url}", function(fbErr, fbRes) {
      //   return User
      //     .create({
      //       email: fbRes.email,
      //       firstName: fbRes.first_name,
      //       lastName: fbRes.last_name,
      //       gender: fbRes.gender,
      //       picture: fbRes.picture.data.url,
      //       timezone: parseInt(fbRes.timezone),
      //       locale: fbRes.locale,
      //       verified: fbRes.verified,
      //       facebookId: parseInt(fbRes.id),
      //       facebookToken: facebook_token,
      //       facebookFriends: {},
      //       facebookSync: new Date()
      //     })
      //     .then(user => {
      //       var data = genToken(user);
      //       data.message = "New User Created!";
      //
      //       res.status(200);
      //       res.json(data);
      //     })
      //     .catch(error => {
      //       res.status(404);
      //       res.json(error);
      //     });
      // });

      var object = FB.getFacebookInfo(facebook_token, function(status, value) {
        if (status == 200) {
          return User
            .create({
              email: value.email,
              firstName: value.first_name,
              lastName: value.last_name,
              gender: value.gender,
              picture: value.picture.data.url,
              timezone: parseInt(value.timezone),
              locale: value.locale,
              verified: value.verified,
              facebookId: parseInt(value.id),
              facebookToken: facebook_token,
              facebookFriends: {},
              facebookSync: new Date()
            })
            .then(user => {
              var data = genToken(user);
              data.message = "New User Created!";

              res.status(200);
              res.json(data);
            })
            .catch(error => {
              res.status(404);
              res.json(error);
            });
        } else {
          res.status(404);
          res.json(value);
        }
      });

  //break;
      // res.status(401);
      // res.json({
      //   "status": 401,
      //   "error": "Invalid credentials"
      // });
      // return;
    }

    // if (dbUserObj) {
    //
    //   // If authentication is success, we will generate a token
    //   // and dispatch it to the client
    //
    //   res.json(genToken(dbUserObj));
    // }

  },

  getUser: function(facebook_token, facebook_id) {
    // spoofing the DB response for simplicity
    // var user = { // spoofing a userobject from the DB.
    //   name: 'arvind',
    //   role: 'admin',
    //   username: 'arvind@myapp.com'
    // };

    //return user;
    return;
  },
}

// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    sub: user.uid,
    exp: expires,
    fb_token: user.facebook_token
  }, config.secretKey);
  return {
    statusCode: 200,
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
