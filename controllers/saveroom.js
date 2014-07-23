module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
	},
	index: function(){
		var sess = this.req.session;
		var _self = this;
		if(_self.req.body.room != undefined){
			sess.room = _self.req.body.room
			sess.save();
		}
		this.render("content", {content: "OK"});
	}
});