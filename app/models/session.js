var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

// create a schema
var sessionSchema = new Schema({
  name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String
});

var Session = mongoose.model('Session', sessionSchema);

// make this available to our users in our Node applications
module.exports = Session;