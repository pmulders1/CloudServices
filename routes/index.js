var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * The view for the Login page.
 * @param {string} request - The request.
 * @param {string} response - The reponse.
 */
router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', { message: req.flash('loginMessage') }); 
});

// process the login form
// app.post('/login', do all our passport stuff here);

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
/**
 * The view for the Signup page.
 * @param {string} request - The request.
 * @param {string} response - The reponse.
 */
router.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup', { message: req.flash('signupMessage') });
});

// process the signup form
// app.post('/signup', do all our passport stuff here);

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
/**
 * The view for the Profile page.
 * @param {string} request - The request.
 * @param {string} response - The reponse.
 */
router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
        user : req.user // get the user out of session and pass to template
    });
});

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/**
 * The post route for an User to try to Signup.
 */
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
/**
 * The post route for an User to try to Login.
 */
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

/**
 * Google Authentication.
 */
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
}));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
