/*
    Authenticatie op de high level routes? -> in app.js en in de router

    TODO
    Middleware terugsturen statuscode/html -> admin en user middelware zetten
    Tests
    frontend - onnodige knoppen weglaten (OPRUIMEN!!!)
    
    EXTRA:
    Locatie taggen op GEO

*/
module.exports = function(cnfg){
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
    var session  = require('express-session');
    var auth = require('./modules/authen');

    var app = express();

    // Models
    require('./models/race');
    require('./models/user');
    require('./models/location');

    var config;
    if(cnfg){
        config = cnfg;
    }else{
        config = require('./config/database');
        require('./models/fillTestData')(mongoose);
    }
    
    // Data Access Layer
    if(mongoose.connection.readyState === 0){
        mongoose.connect(config.url);
    }
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

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

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

    app.use('/',  routes);
    app.use('/races', isLoggedIn, races);
    app.use('/users', users);
    app.use('/locations', isLoggedIn,locations);

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

    return app;
};
