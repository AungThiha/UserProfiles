
var User = require('./models/user'),
    bleach = require('bleach');

module.exports = function(app, passport){

    /* GET */
    app.get('/', function(req, res){

        User.find({}, function(err, users) {
            if (err) throw err;
            // object of all the users
            // console.log(req['sessionID']);
            res.render('pages/index', {users: users, me: req.session['me']});
        });

    });

    app.get('/user/login', function(req, res){
        if (req.session['me']) {
            res.json(req.session['me']);
            return;
        }
        res.render('pages/login');
    });

    app.get('/user/new', function(req, res){
        if (req.session['me']) {
            res.json(req.session['me']);
            return;
        }
        res.render('pages/new_user');
    });

    app.get('/user/edit/:user_id', function(req, res){
        if (!req.session['me'] || req.session['me'].id != req.user.id) {
            res.status(403);
            res.json({ error: true, message: "You're not authorized"});
            return;
        }
        res.render('pages/edit_user', {user: req.user, me: req.session['me']});
    });

    app.get('/user/:user_id', function(req, res){
        res.json(req.user);
    });
    /* END GET */

    /* POST */

        // process the login form
    app.post('/user/login', passport.authenticate('local-login', {
        session: false,
        failureFlash: true
    }), function(req, res){
        res.json(req.session.me);
    });

    // app.post('/user/logout', function(req, res){
        
    // });

    app.post('/user/new', passport.authenticate('local-signup', {
        session: false,
        // successRedirect: '/', // redirect to the secure profile section
        // failureRedirect: '/user/new', // redirect back to the signup page if there is an error
        failureFlash: true // allow Flash messages
    }), function(req, res){
        res.json(req.session.me);
    });

    app.post('/user/delete/:user_id', function(req, res){
        
        if (!req.session['me'] || req.session['me'].id != req.user.id) {
            res.status(403);
            res.json({ error: true, message: "You're not authorized"});
            return;
        }
        if (!req.user) {
            res.status(400);
            res.json({ error: true, message: 'user not exist'});
            return;
        }
        req.user.remove(function(err){
            if (err) {
                res.status(500);
                res.json({ error: true, message: 'database error'});
                return;
            }
            req.session.reset();
            res.json({ error: null, message: 'user deleted'});
        });
    });

    app.post('/user/edit/:user_id', function(req, res){

        if (!req.session['me'] || req.session['me'].id != req.user.id) {
            res.status(403);
            res.json({ error: true, message: "You're not authorized"});
            return;
        }

        if (!req.user) {
            res.status(400);
            res.json({ error: true, message: 'user not exist'});
            return;
        }
        if (!req.body.hasOwnProperty('name')) {
            res.status(400);
            res.json({ error: true, message: 'Invalid Name'});
            return;
        }
        if (!req.body.hasOwnProperty('email') || !User.isValidEmail(req.body.email)) {
            res.status(400);
            res.json({ error: true, message: 'Invalid Email'});
            return;
        }
        if (req.body['phone'] && !User.isValidPhone(req.body.phone)) {
            res.status(400);
            res.json({ error: true, message: 'Invalid Phone'});
            return;
        }
        req.user.name = bleach.sanitize(req.body['name']);
        req.user.email = req.body['email'];
        req.user.phone = req.body['phone'];
        req.user.address = bleach.sanitize(req.body['address']);

        req.user.save(function(err, user){
            if (err){
                res.status(500);
                res.json({ error: true, message: err});
                return;
            }
            res.status(200);
            res.json(user);
        });
    });

    app.param('user_id', function(req, res, next, user_id){
        User.findOne( {'_id' : user_id }, 'name email address', function(err, user){
            if (err) { req.user = null;}
            req.user = user;
            next();
        });
    });

    app.post('/user/logout', function(req, res){
        req.session.reset();
        res.redirect('/');
    });
    /* END POST */


}