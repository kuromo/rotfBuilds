var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('uuid/v4');
var crypto = require('crypto');

var UserSchema = new Schema({
	usrName: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	firstName: String,
	lastName: String,
	isAdmin: Boolean,
	passwordHash: { type: String, required: true },
	passwordSalt: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date
}, {
  collection: 'User'
});

UserSchema.pre('save', function(next) {
	var user = this;
	var salt = uuid();

	if (!user.isModified('passwordHash')) return next();
	
	user.hashPassword(user.passwordHash, salt, function (err, passwordHash) {
		if (err) return next(err);
		user.passwordHash = passwordHash
		user.passwordSalt = salt
		next();
	})
});

UserSchema.methods.hashPassword = function (password, salt, callback) {        
	// pbkdf2 hash, 10k iterations
	var iterations = 10000,
	keyLen = 64; // 64 bit.
	var type = 'sha1'
	crypto.pbkdf2(password, salt, iterations, keyLen, type, callback);
};

UserSchema.methods.comparePw = function(loginPw, cb) {
	var user = this;

	user.hashPassword(loginPw, user.passwordSalt, function (err, passwordHash) {
		if (err) return cb(err);

		if(passwordHash==user.passwordHash){
			cb(null, true);
		}else{
			cb(null, false);
		}
		
	})
};


module.exports = mongoose.model('User', UserSchema);

