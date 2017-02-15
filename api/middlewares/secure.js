var jwt = require('jwt-simple');
var validateUser = require('../server/controllers/auth').validateUser;

module.exports = function(req, res, next) {
  if (req.path == '/auth') return next();

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe.

  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();

  //var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  var token = req.headers.authorization.split(' ')[1];
  //var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

  //if (token || key) {
  if (token) {
    try {
      var decoded = jwt.decode(token, require('../config/secure.js')().secretKey);

      if (decoded.exp <= Date.now()) {
        res.status(400);
        res.json({
          statusCode: 400,
          error: "Token Expired"
        });
        return;
      }

      // Authorize the user to see if s/he can access our resources
      //next();
      res.json(decoded);
      //var dbUser = validateUser(key); // The key would be the logged in user's username
      // if (dbUser) {
      //   if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
      //     next(); // To move to next middleware
      //   } else {
      //     res.status(403);
      //     res.json({
      //       "status": 403,
      //       "error": "Not Authorized"
      //     });
      //     return;
      //   }
      // } else {
      //   // No user with this name exists, respond back with a 401
      //   res.status(401);
      //   res.json({
      //     "status": 401,
      //     "error": "Invalid User"
      //   });
      //   return;
      // }

    } catch (err) {
      res.status(500);
      res.json({
        statusCode: 500,
        error: "Oops something went wrong",
        debug: err.message
      });
    }
  } else {
    res.status(401);
    res.json({
      statusCode: 401,
      error: "Invalid Token or Key"
    });
    return;
  }
};
