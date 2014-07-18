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
		return callback(collection.find({group: group}));
	},
	updatePermission: function(configs){

	},
	deletePermission: function(id){
		
	}
});