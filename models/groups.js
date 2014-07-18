module.exports = Model.extend({
	init: function(db){
		this._super(db);
		this.collection = 'groups';
	},
	addGroup: function(configs){
		var collection = this.getData();
		return collection.insert(configs, {saved: true}, function(err, results){
			console.log(results);
		});
	},
	findGroup: function(callback){
		return callback(collection.find());
	},
	deleteGroup: function(id){
		
	}
});