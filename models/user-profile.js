var User = require('../models/users.js')

var UserProfileModel = function(res, isSes) {
	this.id = isSes ? res.id : this.rot(res.id),
	this.usrName = res.usrName,
	this.email = res.email,
	this.firstName = res.firstName,
	this.lastName = res.lastName,
	this.isAdmin = res.isAdmin
};

//rotate user array
UserProfileModel.prototype.rot = function (uid, cb) {        
	var parts = uid.match(/[\s\S]{1,3}/g) || [];
	parts.reverse()
	var rotId = parts.join("")

	return rotId
};

UserProfileModel.prototype.getUser = function (cb) {        
	User.findById(this.rot(this.id), function(err, user) {
		cb(err, user);
	});
};

module.exports = UserProfileModel;