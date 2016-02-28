
var express = require('express'),
    bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect(require('./config/database').url);
var app = express();

// set the view engine to ejs
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes')(app);

app.listen(8080);
console.log('App started! Look at http://localhost:8080');
