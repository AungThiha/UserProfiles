var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  password: String
});

// checking if password is valid
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);


// methods =============
// generating a hash
User.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.isValidEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

User.isValidPhone = function(phone){
	var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
	return re.test(phone);
};


// make this available to our users in our Node applications
module.exports = User;