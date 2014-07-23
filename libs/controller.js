Controller = Class.extend({
	init: function(req, res){
		this.res = res;
		this.req = req;
	},
	render: function(template, configs){
		return this.res.render(template, configs);
	},
	newDB: function(name){
		var model = require(__dirname + "/models/" + name +".js");
		return new model(this.req.db);
	}
});