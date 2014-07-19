module.exports = Model.extend({
	init: function(db){
		this._super(db);
		this.collection = 'rooms';
	},
	addRoom: function(configs, callback){
		var collection = this.getData();
		return collection.insert(configs, {saved: true}, function(err, results){
			console.log(results);
			if (callback) callback();
		});
	},
	findRoom: function(room, callback){
		var collection = this.getData();
		if (room){
			collection.find({name: room}).toArray(function(err, results){
				callback(results[0]);
			});
		}
		else{
			collection.find().toArray(function(err, results){
				callback(results);
			});
		}
	},
	updateMSGRoom: function(room, msg){
		var collection = this.getData();
		collection.find({name: room}).toArray(function(err, results){
			if(!err && results[0]){
				var msgs = results[0].msgs;
				msgs = msgs.concat(msg);
				collection.update({name: room},{$set:{msgs: msgs}},function(err, results){
				});
			}
		});
		
	},
	deleteRoom: function(id){
		
	}
});