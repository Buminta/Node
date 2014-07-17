module.exports = Model.extend({
	init: function(db){
		this._super(db);
		this.collection = 'nodechat_users';
	},
	addUser: function(configs){
		var collection = this.getData();
		collection.insert(configs);
		return true;
	},
	findUser: function(user, password){
		return false;
		var collection = this.getData();
		if(!password){
			return collection.find({username: user});
		}
		else{
			return collection.find({username: user, password: password});
		}
	}
});