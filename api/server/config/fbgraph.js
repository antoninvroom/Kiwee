var Q = require('q');
var graph = require('fbgraph');

var facebook = {

  getFacebookInfo: function(access_token, callback) {

    function setUp(access_token) {
      graph.setAccessToken(access_token);
    }

    setUp(access_token);

    function getFBInfo() {
      var deferred = Q.defer();
      graph.get("/me?fields=email,first_name,last_name,gender,verified,locale,timezone,friends,picture.width(720).height(720){url}", function(err, res) {
        if (err) deferred.reject(err);
        deferred.resolve(res);
      });
      return deferred.promise;
    }

        // function handleResult(result) {
        //     var deferred = Q.deferred();
        //
        //     result.posts = result.feed.data
        //     delete result.feed.data;
        //
        //     result.photos = result.photos.data
        //     delete result.photos.data;
        //
        //     deferred.resolve(result);
        //
        //     return deferred.promise
        // }

    Q.fcall(getFBInfo)
     .then(function(result) {
        callback(200, result);
     })
     .catch(function(error) {
        // Handle any error from all above steps
        callback(400, error);
     })
     .done();
  }

};

module.exports = facebook;
