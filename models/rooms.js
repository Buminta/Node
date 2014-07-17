module.exports = Model.extend({
	init: function(db){
		this._super(db);
		this.collection = 'rooms';
	},
	addRoom: function(configs){
		var collection = this.getData();
		return collection.insert(configs, {saved: true}, function(err, results){
			console.log(results);
		});
	},
	findRoom: function(callback){
		var collection = this.getData();
		collection.find().toArray(function(err, results){
			callback(results);
		});
	},
	updateMSGRoom: function(msg){

	},
	deleteRoom: function(id){
		
	}
});