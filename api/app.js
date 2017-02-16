var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var colors = require('colors/safe');
var config = require('./config/config.js');

var routes = require('./server/routes');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-Type,User-Agent,Authorization,app_version,platform,os_version');

  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.all('/v1/*', [require('./middlewares/secure')]);

app.use('/', routes);

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        statusCode: err.status || 500,
        error: err.message
    });
});


// Start the server
app.set('port', process.env.PORT || 10000);

var server = app.listen(app.get('port'), function() {
  console.log(colors.bold('>> Welcome on Kiwee! =)'));
  console.log(colors.italic('Server listening on port ' + server.address().port));
  console.log(colors.italic('Ready to use!'));
});

module.exports = app;
