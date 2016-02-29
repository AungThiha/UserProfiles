
// load all the things we need
 var localStrategy = require('passport-local').Strategy;

 // load up the user model
 var User = require('../app/models/user'),
    bleach = require('bleach');

 // expose this function to our app using module.exports
 module.exports = function(passport){
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new localStrategy({
    	// by default, local strategy uses username and password, we will override with email
    	usernameField: 'email',
    	passwordField: 'password',
    	passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done){
    	// asynchronous
    	// User.findOne won't fire unless data is sent back
    	process.nextTick(function(){

    		// find a user whose email is the same as the forms email
    		// we are checking to see if the user trying to login already exists
    		User.findOne({ 'email' : email}, function(err, user){
    			// if there are any errors, return the error
    			if (err) {
    				return done(err);
    			}

    			// check to see if there's already a user with that email

    			if (user) {
    				return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    			}else {

    				if (!req.body.hasOwnProperty('name') ) {
			            return done(null, false, req.flash('signupMessage', 'Please, enter name'));
			        }
			        if (!req.body.hasOwnProperty('email') || !User.isValidEmail(req.body.email)) {
			            return done(null, false, req.flash('signupMessage', 'Please, enter valid email'));
			        }
			        if (req.body['phone'] && !User.isValidPhone(req.body.phone)) {
			            return done(null, false, req.flash('signupMessage', 'Please, enter valid phone'));
			        }

    				// if there is no user with that email
    				// create the user
    				var newUser = User({
			            name: bleach.sanitize(req.body['name']),
			            email: email,
			            phone: req.body['phone'],
			            address: bleach.sanitize(req.body['address']),
			            password: User.generateHash(password)
			        });

    				// save the user
    				newUser.save(function(err, user){
    					if (err) {
    						throw err;
    					}

    					req.session.me = {
			    			id: user.id,
			    			name: user.name,
			    			email: user.email,
			    			phone: user.phone,
			    			address: user.address,
			    		};

    					return done(null, newUser);
    				});
    			}
    		});
    	});

    }));


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-login', new localStrategy({
    	// by default, local strategy uses username and password, we will override with email
    	usernameField: 'email',
    	passwordField: 'password',
    	passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

    	// find a user whose email is the same as the forms email
    	// we are checking to see if the user trying to login already exists
    	User.findOne({ 'email' : email }, function(err, user){
    		if (err) {
    			return done(err);
    		}

    		// if no user is found, return the message
    		if (!user) {
    			return done(null, false, req.flash('loginMessage', 'No user found.'));
    		}

    		// if the user is found but the password is wrong
    		if (!user.validPassword(password)) {
    			return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
    		}

    		req.session.me = {
    			id: user.id,
    			name: user.name,
    			email: user.email,
    			phone: user.phone,
    			address: user.address,
    		};
    		// all is well, return successful use
    		return done(null, user);
    	});
    }
    )); // END LOGIN
 };