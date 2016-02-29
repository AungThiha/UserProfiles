
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    session = require('client-sessions');

var port = process.env.PORT || 8080;
var app = express();

mongoose.connect(require('./config/database').url);

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser("3dafjoei32j30dvnqxmziea33"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// required for passport
// var MongoStore = require('connect-mongo')(session);
app.use(session({
    cookieName: 'session', // cookie name dictates the key name added to the request object
    secret: '3dafjoei32j30dvnqxmziea33', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    cookie: {
        maxAge: 24 * 60 * 60 * 10000, // duration of the cookie in milliseconds, defaults to duration above
        ephemeral: false, // when true, cookie expires when the browser closes
        httpOnly: true, // when true, cookie is not accessible from javascript
        secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
  }
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/routes')(app, passport);

app.listen(port);
console.log('App started! Look at ' + port);
