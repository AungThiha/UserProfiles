
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose');

var app = express();

// set the view engine to ejs
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser("3dafjoei32j30dvnqxmziea33"));

mongoose.connect(require('./config/database').url);

require('./app/routes')(app);

app.listen(8080);
console.log('App started! Look at http://localhost:8080');
