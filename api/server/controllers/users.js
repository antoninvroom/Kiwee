const User = require('../models').User;

var users = {
  // Create a new user
  create: function(req, res) {
    return User
      .create({
        id: "8933dd9a-d844-4875-81fb-53f1afe05bbe",
        email: "marcus.leh@gmail.com",
        firstName: "Marcus",
        lastName: "Lehembre",
        gender: "male",
        picture: "http",
        country: "France",
        timezone: 1,
        locale: "fr_FR",
        verified: false,
        facebookId: req.body.facebook_id,
        facebookToken: req.body.facebook_token,
        facebookFriends: {},
        facebookSync: new Date()
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));

    //var id = req.params.id;
    //var user = data[0]; // Spoof a DB call
    //res.json(user);
  },

  // Get the public profile of a user IF THEY ARE FRIENDS
  getOne: function(req, res) {
    var id = req.params.id;
    var user = data[0]; // Spoof a DB call
    res.json(user);
  },

  me: function(req, res) {
    var newuser = req.body;
    data.push(newuser); // Spoof a DB call
    res.json(newuser);
  },

  sync: function(req, res) {
    var updateuser = req.body;
    var id = req.params.id;
    data[id] = updateuser // Spoof a DB call
    res.json(updateuser);
  }

};

module.exports = users;
