
var User = require('./models/user'),
    Session = require('./models/session'),
    bleach = require('bleach');

module.exports = function(app){

    /* GET */
    app.get('/', isLoggedIn ,function(req, res){

        User.find({}, function(err, users) {
            if (err) throw err;
            // object of all the users
            res.render('pages/index', {users: users, user: req.user});
        });

    });


    app.get('/user/login', isLoggedIn, function(req, res){
        if (req.user) {
            res.redirect('/');
            return;
        }
        res.render('pages/login');
    });

    app.get('/user/new', function(req, res){
        res.render('pages/new_user');
    });

    app.get('/user/edit/:user_id', function(req, res){
        res.render('pages/edit_user', {user: req.user});
    });

    app.get('/user/:user_id', function(req, res){
        res.json(req.user);
    });
    /* END GET */

    /* POST */

    app.post('/user/login', function(req, res){
        var email = req.body['email'];
        var password = req.body['password'];
        User.findOne({ email: email}, function(err, user){
            if (err) {
                res.status(400);
                res.json({ error: true, message: err});
            }
            if (user.validPassword(password)) {
                var session = Session({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address
                });
                session.save(function(err, session){
                    if (err){
                        res.status(500);
                        res.json({ error: true, message: err});
                        return;
                    }
                    res.cookie('token', session.id, { maxAge: 9999999 });
                    res.json({error: null, message: 'user created'});
                });
            }
        });
    });

    app.post('/user/logout', function(req, res){
        if (req.cookies.token) {
            Session.remove({ '_id': req.cookies.token}, function(err){
                if (err) {
                    res.status(500);
                    res.json({ error: true, message: err});
                }
                res.clearCookie('token');
                res.json({ error: null, message: "successfully logged out."});
            });  
        }else{
            res.status(403);
            res.json({ error: true, message: "You're not logged in"});
        }
        
        
    });



    app.post('/user/new', function(req, res){

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
        var newUser = User({
            name: bleach.sanitize(req.body['name']),
            email: req.body['email'],
            phone: req.body['phone'],
            address: bleach.sanitize(req.body['address']),
            password: User.generateHash(req.body['password'])
        });

        newUser.save(function(err, user){
            if (err){
                res.status(500);
                res.json({ error: true, message: err});
                return;
            }
            var session = Session({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            });
            session.save(function(err, session){
                if (err){
                    res.status(500);
                    res.json({ error: true, message: err});
                    return;
                }
                res.cookie('token', session.id, { maxAge: 9999999 });
                res.json({error: null, message: 'user created'});
            });
        });

    });

    app.post('/user/delete/:user_id', function(req, res){
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
            res.json({ error: null, message: 'user deleted'});
        });
    });

    app.post('/user/edit/:user_id', function(req, res){
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
        User.findOne( {'_id' : user_id }, function(err, user){
            if (err) { req.user = null;}
            req.user = user;
            next();
        });
    });
    /* END POST */


    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next){
        // if user is authenticated in the session, carry on
        if (req.cookies.token){
            Session.findById(req.cookies.token, function(err, session){
                if (err) {
                    res.clearCookie('token');
                    return next();
                }
                req.user = session;
                return next();
            });
        }else{
            return next();
        }
        
    }


}