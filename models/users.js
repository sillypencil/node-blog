var User = require("../lib/mongo").User;

module.exports = {
	create: function create(user) {
		return User.create(user).exec();
	},
	getUserByUsername: function getUserByUsername(username){
		return User
			.findOne({username:username})
			.addCreatedAt()
			.exec();
	},
	getNickname: function( _id ){
		return User
			.findOne({_id: _id},{nickName:1}).exec();
	}
}