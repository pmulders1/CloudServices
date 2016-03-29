/*
    Locatie - verwijder bij het uithalen van de array in races.
    Authenticatie op de high level routes?
    Documentatie voor de api?
    Wil je niet dat mensen een race joinen VOORDAT die begint
    Standaard admin wachtwoord gaat niet goed

    TODO
    Locatie kunnen taggen
    Tests
    Middleware terugsturen statuscode/html
    Validation
    pagination
    frontend - onnodige knoppen weglaten (OPRUIMEN!!!)
*/

var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');

var auth = require('./modules/authen');

var app = express();

// Models
require('./models/race')(mongoose);
require('./models/user')(mongoose, bcrypt);
require('./models/location')(mongoose);
require('./models/fillTestData')(mongoose);

// Data Access Layer
mongoose.connect('mongodb://mdb5:mdb5@ds015859.mlab.com:15859/cloudservicesmbd5');
require('./public/javascripts/passport')(passport); // pass passport for configuration

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('hbs', exphbs({extname:'.hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

function handleError(req, res, statusCode, message){
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.json(message);
};

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Routes
var routes = require('./routes/index');
var users = require('./routes/users')(mongoose, handleError);
var races = require('./routes/races')(mongoose, handleError);
var locations = require('./routes/locations')(mongoose, handleError);
// /Routes



app.use('/', routes);
app.use('/races', races);
app.use('/users', users);
app.use('/locations', locations);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
