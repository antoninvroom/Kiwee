var jwt = require('jwt-simple');
var config = require('../../config/config');
var users = require('../controllers/users.js');
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

      return newUser = User
        .create({
          id: "8933df1a-d844-4875-81fb-93f1afe05bbe",
          email: "marcus.leh@gmail.com",
          firstName: "Marcus",
          lastName: "Lehembre",
          gender: "male",
          picture: "http",
          country: "France",
          timezone: 1,
          locale: "fr_FR",
          verified: false,
          facebookId: parseInt(req.body.facebook_id),
          facebookToken: req.body.facebook_token,
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



      // res.status(401);
      // res.json({
      //   "status": 401,
      //   "error": "Invalid credentials"
      // });
      // return;
    }

    if (dbUserObj) {

      // If authentication is success, we will generate a token
      // and dispatch it to the client

      res.json(genToken(dbUserObj));
    }

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
