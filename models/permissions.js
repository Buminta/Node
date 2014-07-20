module.exports = Model.extend({
	init: function(db){
		this._super(db);
		this.collection = 'permissions';
	},
	addPermission: function(configs){
		var collection = this.getData();
		return collection.insert(configs, {saved: true}, function(err, results){
			console.log(results);
		});
	},
	findPermission: function(group, callback){
		var collection = this.getData();
		return callback(collection.find({group: group}).toArray(function(err, results){
			callback(results);
		}));
	},
	checkPermission: function(group, configs, callback){
		var collection = this.getData();
		return collection.find({group: group, controller: configs.controller, action: configs.action}).toArray(function(err, results){
			if(results.length > 0) callback(true);
			else callback(false);
		});
	},
	updatePermission: function(configs){

	},
	deletePermission: function(id){
		
	}
});