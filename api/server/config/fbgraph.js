var q = require('q');
var graph = require('fbgraph');

var facebook = {

  getFacebookInfo: function(access_token, callback) {

    function setUp(access_token) {
      graph.setAccessToken(access_token);
    }

    setUp(access_token);

    function getFBInfo() {
      var deferred = q.defer();

      graph.get("/me?fields=email,first_name,last_name,gender,verified,locale,timezone,friends,picture.width(160).height(160){url}", function(err, res) {
        if (err) deferred.reject(err);
        deferred.resolve(res);
      });
      return deferred.promise;
    }

    q.fcall(getFBInfo)
     .then(function(result) {
        callback(200, result);
     })
     .catch(function(error) {
        // Handle any error from all above steps
        if (error.code == 190) {
          // fb token expired
          callback(401, {
            statusCode: 401,
            code: 190,
            message: "Facebook Token expired or is not valid => logout the user from the app",
            action: "logout"
          });
        } else {
          console.log(error);
          error.statusCode = error.code;
          error.action = "logout";
          callback(400, error);
        }
     })
     .done();
  }

};

module.exports = facebook;
