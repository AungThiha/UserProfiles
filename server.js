
var express = require('express'),
    bleach = require('bleach'),
    bodyParser = require('body-parser'),
    User = require('./user'),
    validators = require('./validators');
var app = express();

// set the view engine to ejs
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* GET */
app.get('/', function(req, res){

	User.find({}, function(err, users) {
        if (err) throw err;
        // object of all the users
        res.render('pages/index', {users: users});
    });

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
app.post('/user/new', function(req, res){

    if (!req.body.hasOwnProperty('name')) {
        res.status(400);
        res.json({ error: true, message: 'Invalid Name'});
        return;
    }
    if (!req.body.hasOwnProperty('email') || !validators.isValidEmail(req.body.email)) {
        res.status(400);
        res.json({ error: true, message: 'Invalid Email'});
        return;
    }
    if (req.body['phone'] && !validators.isValidPhone(req.body.phone)) {
        res.status(400);
        res.json({ error: true, message: 'Invalid Phone'});
        return;
    }
    var newUser = User({
        name: bleach.sanitize(req.body['name']),
        email: req.body['email'],
        phone: req.body['phone'],
        address: bleach.sanitize(req.body['address'])
    });

    newUser.save(function(err){
        if (err){
            res.status(500);
            res.json({ error: true, message: err});
            return;
        }
        res.status(200);
        res.json({error: null, message: 'user created'});
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
    if (!req.body.hasOwnProperty('email') || !validators.isValidEmail(req.body.email)) {
        res.status(400);
        res.json({ error: true, message: 'Invalid Email'});
        return;
    }
    if (req.body['phone'] && !validators.isValidPhone(req.body.phone)) {
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

app.listen(8080);
console.log('App started! Look at http://localhost:8080');
