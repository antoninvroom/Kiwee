var jwt = require('jwt-simple');
var config = require('../../config/config.js');
var users = require('../controllers/users.js');
//var graph = require('fbgraph');
var FB = require('../config/fbgraph.js');

const User = require('../models').User;

var auth = {

  connect: function(req, res) {

    var facebook_token = req.body.facebook_token || '';
    var facebook_id = req.body.facebook_id || '';

    if (facebook_token == '' || facebook_id == '') {
      res.status(401);
      res.json({
        statusCode: 401,
        error: 'Invalid credentials',
        action: 'logout'
      });
      return;
    }

    // On vérifie si l'utilisateur existe dans la base de données
    FB.getFacebookInfo(facebook_token, function(statusCode, object) {
      if (statusCode == 200) {
        // Le token est valide, on a les données d'un utilisateur Facebook
        console.log(object);
        // Vérifions si l'utilisateur qu'on a avec le token est le même que l'ID renseigné (sécurité)
        if (facebook_id != object.id) {
          res.status(409);
          res.json({
            statusCode: 409,
            message: 'Access Denied: facebook ID doesn\'t match with its token',
            action: 'logout'
          });

          return;
        }

        // Si tout est bon, on vérifie si l'utilisateur existe ou non
        User.find({
            where: {
              facebookId: object.id
            }
          })
          .then((user) => {
            console.log(2);
            if (!user) {
              console.log(1);
              // L'utilisateur n'existe pas, on l'enregistre
              User.create({
                  email: object.email,
                  firstName: object.first_name,
                  lastName: object.last_name,
                  gender: object.gender,
                  picture: object.picture.data.url,
                  timezone: parseInt(object.timezone),
                  locale: object.locale,
                  verified: object.verified,
                  facebookId: parseInt(object.id),
                  facebookToken: facebook_token,
                  facebookFriends: object.friends.data,
                  facebookSync: new Date()
                })
                .then((user) => { // succès !
                  var data = genToken(user);
                  data.message = "New user created!";
                  data.action = 'login'; // on autorise la connexion

                  res.status(200);
                  res.json(data);
                })
                .catch((error) => {
                  console.log(error);

                  res.status(404);
                  res.json(error);
                });

              return;
            } else {
              console.log(3);
              user.update({
                  email: object.email,
                  picture: object.picture.data.url,
                  verified: object.verified,
                  facebookToken: facebook_token,
                  facebookFriends: object.friends.data,
                  facebookSync: new Date()
                })
                .then((user) => {
                  var data = genToken(user);
                  data.message = "User updated!";
                  data.action = 'login';

                  res.status(200);
                  res.json(data);
                })
                .catch((error) => {
                  console.log(error);

                  res.status(404);
                  res.json(error);
                });

              return;
            }
          })
          .catch((error) => {
            console.log(error);

            res.status(404);
            res.json(error);
            return;
          });

      } else {
        // Un problème avec le token
        res.status(statusCode);
        res.json(object);
        return;
      }
    });

    return;
  }
};

// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    sub: user.id,
    exp: expires,
    fb_token: user.facebookToken,
    fb_id: user.facebookId
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
