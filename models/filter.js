module.exports = Model.extend({
	init: function(db){
		this._super(db);
		this.collection = 'filter';
	},
	addFilter: function(configs){
		var collection = this.getData();
		return collection.insert(configs, {saved: true}, function(err, results){
			console.log(results);
		});
	},
	findFilter: function(callback){
		var collection = this.getData();
		return collection.find().toArray(function(err, results){
			callback(results);
		});
	},
	deleteFilter: function(id){
		var collection = this.getData();
		var ObjectId = require('mongoose').Types.ObjectId;
		return collection.remove({_id: new ObjectId(id)});
	},
	replaceWord: function(msg, callback){
		var collection = this.getData();
		return collection.find().toArray(function(err, results){
			for(var i=0; i< results.length; i++){
				msg = msg.replace(" "+results[i].word+" ", " *** ");
				if(msg.length == results[i].word.length) msg = msg.replace(results[i].word, "***");
				if(msg.indexOf(results[i].word) == 0) msg = msg.replace(results[i].word+" ", "*** ");
				if(msg.indexOf(results[i].word) == (msg.length - results[i].word.length)) msg = msg.replace(" "+results[i].word, " ***");
			}
			callback(msg);
		});
	}
});