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
	findRoom: function(room, callback, find_for_name){
		var collection = this.getData();
		var ObjectId = require('mongoose').Types.ObjectId;
		if (room && !find_for_name){
			try{
				collection.find({_id: new ObjectId(room)}).toArray(function(err, results){
					callback(results[0]);
				});
			}
			catch(error){
				callback({name: "Begining"});
			}
		}
		else if(room && find_for_name){
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
		try{
			var ObjectId = require('mongoose').Types.ObjectId;
			var collection = this.getData();
			collection.find({_id: new ObjectId(room)}).toArray(function(err, results){
				if(!err && results[0]){
					var msgs = results[0].msgs;
					msgs = msgs.concat(msg);
					collection.update({_id:  new ObjectId(room)},{$set:{msgs: msgs}},function(err, results){
					});
				}
			});
		}
		catch(err){
			
		}
	},
	updateRoom: function(room, msgs){
		try{
			var ObjectId = require('mongoose').Types.ObjectId;
			var collection = this.getData();
			collection.update({_id:  new ObjectId(room)},{$set:{msgs: msgs}},function(err, results){
			});
		}
		catch(err){
			
		}
	},
	deleteRoom: function(id){	
		var collection = this.getData();
		var ObjectId = require('mongoose').Types.ObjectId;
		return collection.remove({_id: new ObjectId(id)});
	}
});