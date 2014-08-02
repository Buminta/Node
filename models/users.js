module.exports = Model.extend({
	init: function(db){
		this._super(db);
		this.collection = 'users';
	},
	addUser: function(configs){
		var collection = this.getData();
		return collection.insert(configs, {saved: true}, function(err, results){
			console.log(results);
		});
	},
	findUser: function(user, password){
		var collection = this.getData();
		if(!password){
			return collection.find({username: user});
		}
		else{
			return collection.find({username: user, password: password});
		}
	},
	getAllUser: function(callback){
		var collection = this.getData();
		return collection.find().toArray(function(err, results){
			callback(results);
		});
	},
	updateUser: function(configs){
		var ObjectId = require('mongoose').Types.ObjectId;
		var collection = this.getData();
		collection.update({_id:  new ObjectId(configs.id)},{$set:{password: configs.password}},function(err, results){
		});
	},
	deleteUser: function(id){
		var collection = this.getData();
		var ObjectId = require('mongoose').Types.ObjectId;
		return collection.remove({_id: new ObjectId(id)});
	}
});